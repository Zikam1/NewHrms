import { createWebHistory, createRouter } from "vue-router"

import Dashboard from "@/views/app/Dashboard.vue"
import NotFound from "@/views/general/NotFound.vue"
import Bio from "@/views/app/dashboardTabs/Bio.vue"
import Job from "@/views/app/dashboardTabs/Job.vue"
import EmploymentHistory from "@/views/app/dashboardTabs/EmploymentHistory.vue"
import Certifications from "@/views/app/dashboardTabs/Certifications.vue"
import Employees from "@/views/app/admin/Employees.vue"
import Department from "@/views/app/sidebarTabs/Department"
import Leave from "@/views/app/sidebarTabs/Leave"
import HRLeave from "@/views/app/hr/HRLeave"
import TeamMembersLeave from "@/views/app/manager/TeamMembersLeave.vue"
import LeaveApplications from "@/views/app/manager/LeaveApplications.vue"
import PersonalInfo from "@/views/app/sidebarTabs/PersonalInfo"
import Projects from "@/views/app/sidebarTabs/Projects"
import StaffDashboardStats from "@/views/app/StaffDashboardStats.vue"
import HRDashboardStats from "@/views/app/HRDashboardStats.vue"
import ChangePassword from "@/views/auth/ChangePassword.vue"
import Login from "@/views/auth/Login.vue"

import store from "@/store"
import { ACCOUNT_TYPES } from "@/global/accountTypes"
import { ROUTES } from "@/global/routes"

const routes = [
	{
		path: "/login",
		name: ROUTES.login,
		component: Login,
		meta: { title: "Login" },
	},
	{
		path: "/",
		name: ROUTES.home,
		component: Dashboard,
		meta: { title: "CypherCrescent Portal" },
		beforeEnter: (to, from, next) => {
			store.getters["appStore/authenticated"]
				? next()
				: next({ name: "Login" })
		},
		children: [
			{
				path: "/dashboard",
				component: StaffDashboardStats,
				name: ROUTES.staffDashboard,
				beforeEnter: (to, from, next) => {
					if (
						store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.admin
					) {
						next("/employees")
					} else if (
						store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.HR
					) {
						next("/dashboard/human-resources")
					} else {
						next()
					}
				},
			},
			{
				path: "/dashboard/human-resources",
				component: HRDashboardStats,
				name: ROUTES.hrDashboard,
				beforeEnter: (to, from, next) => {
					store.getters["appStore/user"]?.accountType ===
					ACCOUNT_TYPES.HR
						? next()
						: next("/")
				},
			},
			{
				path: "/employees",
				component: Employees,
				name: ROUTES.employees,
				beforeEnter: (to, from, next) => {
					store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.admin ||
					store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.HR
						? next()
						: next("/")
				},
			},
			{
				path: "/projects",
				component: Projects,
				name: ROUTES.projects,
				beforeEnter: (to, from, next) => {
					store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.staff ||
					store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.manager
						? next()
						: next("/")
				},
			},
			{
				path: "/leave",
				component: Leave,
				name: ROUTES.leave,
				beforeEnter: (to, from, next) => {
					if (
						store.getters["appStore/user"]?.accountType ===
							ACCOUNT_TYPES.manager ||
						store.getters["appStore/user"]?.accountType ===
							ACCOUNT_TYPES.staff
					) {
						next()
					} else if (
						store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.HR
					) {
						next("/leave/human-resources")
					} else {
						next("/")
					}
				},
			},
			{
				path: "/leave/human-resources",
				component: HRLeave,
				name: ROUTES.hrLeave,
				beforeEnter(to, from, next) {
					store.getters["appStore/user"]?.accountType ===
					ACCOUNT_TYPES.HR
						? next()
						: next("/leave")
				},
			},
			{
				path: "/leave/team-members",
				name: ROUTES.viewTeamLeaveInfo,
				component: TeamMembersLeave,
				beforeEnter: (to, from, next) => {
					store.getters["appStore/user"]?.accountType ===
					ACCOUNT_TYPES.manager
						? next()
						: next("/leave")
				},
			},
			{
				path: "/leave/applications",
				name: ROUTES.managerViewLeaveApplications,
				component: LeaveApplications,
				beforeEnter: (to, from, next) => {
					store.getters["appStore/user"]?.accountType ===
					ACCOUNT_TYPES.manager
						? next()
						: next("/leave")
				},
			},
			{
				path: "/department",
				name: ROUTES.departments,
				component: Department,
			},
			{
				path: "/me",
				name: ROUTES.userInfo,
				component: PersonalInfo,
				beforeEnter: (to, from, next) => {
					store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.manager ||
					store.getters["appStore/user"]?.accountType ===
						ACCOUNT_TYPES.staff
						? next()
						: next("/")
				},
				children: [
					{ path: "/me/bio", component: Bio, name: ROUTES.bio },
					{ path: "/me/job", component: Job, name: ROUTES.job },
					{
						path: "/me/employment-history",
						component: EmploymentHistory,
						name: ROUTES.employmentHistory,
					},
					{
						path: "/me/certifications",
						component: Certifications,
						name: ROUTES.certifications,
					},
					// {
					//   path: '/me/confirmation',
					//   name: ROUTES.confirmation,
					//   component: Confirmation,
					// },
				],
			},
		],
	},
	{
		path: "/change-password",
		name: ROUTES.changePassword,
		component: ChangePassword,
		meta: { title: "Change Password" },
	},
	{
		path: "/:catchAll(.*)",
		component: NotFound,
		meta: { title: "404 Page not found" },
	},
]

const appRouter = createRouter({
	history: createWebHistory(),
	routes: routes,
})

appRouter.beforeEach((to, from, next) => {
	document.title = to.meta.title
	next()
})

export default appRouter

// import { ACCOUNT_TYPES } from '@/global/accountTypes'
// import { ROUTES } from '@/global/routes'
// import store from '@/store'
// import LoginVue from '@/views/auth/Login.vue'
// import { createRouter, createWebHistory } from 'vue-router'
// import adminRoutes from '@/router/adminRoutes'
// import hrRoutes from '@/router/hrRoutes'
// import managerRoutes from '@/router/managerRoutes'
// import staffRoutes from '@/router/staffRoutes'

// let otherRoutes = null

// // Optionally select routes depending on account type
// if (store.getters['appStore/user']?.accountType === ACCOUNT_TYPES.admin) {
//   otherRoutes = adminRoutes
// } else if (
//   store.getters['appStore/user']?.accountType === ACCOUNT_TYPES.staff
// ) {
//   otherRoutes = staffRoutes
// } else if (
//   store.getters['appStore/user']?.accountType === ACCOUNT_TYPES.manager
// ) {
//   otherRoutes = managerRoutes
// } else if (store.getters['appStore/user']?.accountType === ACCOUNT_TYPES.HR) {
//   otherRoutes = hrRoutes
// }

// const routes = [
//   {
//     path: '/auth',
//     name: 'Auth',
//     children: [
//       { path: '/auth/login', name: ROUTES.login, component: LoginVue },
//     ],
//   },
//   ...otherRoutes,
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes: routes,
// })

// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title
//   next()
// })

// export default router
