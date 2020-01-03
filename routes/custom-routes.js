const useLogin = require("./login-route");
const createChore = require("./create-chore-route");

const routesList = [];

routesList.push(useLogin);
routesList.push(createChore);

const useCustomRoutes = app => {
	routesList.forEach(useRoute => {
		useRoute(app);
	});
};

module.exports = useCustomRoutes;
