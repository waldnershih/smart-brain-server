const jwt = require("jsonwebtoken");
const redis = require("redis");

// setup redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return Promise.reject("incorrect form submission");
	}
	return db
		.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", email)
					.then((user) => user[0])
					.catch((err) => Promise.reject("unable to get user"));
			} else {
				Promise.reject("wrong credentials");
			}
		})
		.catch((err) => Promise.reject("something went wrong"));
};

const getAuthTokenId = (req, res) => {
	const { authorization } = req.headers;
	const token = authorization.split(" ")[1];
	redisClient.get(token, (err, reply) => {
		if (err || !reply) {
			return res.status(401).json("Unauthorized");
		} else {
			return res.json({ id: reply });
		}
	});
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
	// console.log("lolololol", req.headers);
	const { authorization } = req.headers;
	return authorization
		? getAuthTokenId(req, res)
		: handleSignin(db, bcrypt, req, res)
				.then((data) => {
					return data.id && data.email
						? createSessions(data)
						: Promise.reject(data);
				})
				.then((session) => {
					return res.json(session);
				})
				.catch((err) => res.status(400).json(err));
};

const createSessions = (user) => {
	// JWT token, return user data
	const { id, email } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => ({
			success: true,
			userId: id,
			token,
		}))
		.catch((err) => console.log(err));
};

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value));
};

module.exports = {
	handleSignin,
	signinAuthentication,
	redisClient,
};
