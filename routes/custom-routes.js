const useLogin = require("./login-route");
const createChore = require("./chores-routes");
const registerUser = require("./register-route");
const childrenRoutes = require("./children-routes");

const routesList = [];

routesList.push(useLogin);
routesList.push(createChore);
routesList.push(registerUser);
routesList.push(childrenRoutes);

const useCustomRoutes = app => {
	routesList.forEach(useRoute => {
		useRoute(app);
	});
};

module.exports = useCustomRoutes;
