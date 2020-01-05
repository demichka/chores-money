const useLogin = require("./login-route");
const createChore = require("./chores-routes");
const registerUser = require("./register-route");
const childrenRoutes = require("./children-routes");
const transactionsRoutes = require("./transactions-routes");
const userActivityRoutes = require("./user-activity-route");
const getParentsList = require("./get-parents-list-route");

const routesList = [];

routesList.push(useLogin);
routesList.push(createChore);
routesList.push(registerUser);
routesList.push(childrenRoutes);
routesList.push(transactionsRoutes);
routesList.push(userActivityRoutes);
routesList.push(getParentsList);

const useCustomRoutes = app => {
	routesList.forEach(useRoute => {
		useRoute(app);
	});
};

module.exports = useCustomRoutes;
