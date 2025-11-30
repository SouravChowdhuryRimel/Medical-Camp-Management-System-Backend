import { Router } from "express";
import path from "path";
import authRoute from "./app/modules/auth/auth.route";
import userRoute from "./app/modules/user/user.route";
import { PatientRegistrationRoutes } from "./app/modules/patientRegistration/patientRegistration.route";
import { eventManagementRouter } from "./app/modules/eventManagements/eventManagement.route";
import { patientManagementRoute } from "./app/modules/patientManagements/patientManagement.route";
import { UserManagementRoutes } from "./app/modules/userManagements/userManagement.route";
import { NotificationRoutes } from "./app/modules/notifications/notification.route";
import { configurationRoutes } from "./app/modules/configurations/configuration.route";
import { reportRoutes } from "./app/modules/reports/report.route";
import { keyContacts } from "./app/modules/keyContacts/keyContact.route";

const appRouter = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoute },
  { path: "/user", route: userRoute },
  { path: "/patient-registration", route: PatientRegistrationRoutes },
  { path: "/event-management", route: eventManagementRouter },
  { path: "/patient-management", route: patientManagementRoute },
  { path: "/user-management", route: UserManagementRoutes },
  { path: "/notification", route: NotificationRoutes },
  { path: "/configuration", route: configurationRoutes },
  { path: "/reports", route: reportRoutes },
  { path: "/key-contacts", route: keyContacts },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
