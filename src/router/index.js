import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/menu/Login'
import Admin from '../components/menu/Admin'
import adminStudent from '../components/admin/Student'
import adminTeacher from '../components/admin/Teacher'
import Page from '../components/home/Page'
import SendNotice from '../components/teacher/SendNotice'
import Teacher from '../components/menu/Teacher'
import Leave from '../components/teacher/Leave'
import User from '../components/teacher/User'
import Student from '../components/menu/Student'
import MyNotice from '../components/student/MyNotice'
import HealthTable from '../components/student/HealthTable'
import Application from '../components/student/Application'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/admin',
    component: Admin,
    children: [{
        path: 'student',
        component: adminStudent
      },
      {
        path: 'teacher',
        component: adminTeacher
      },
      {
        path: 'home',
        component: Page
      },
      {
        path: 'noticeSend',
        component: SendNotice
      }
    ]
  },
  {
    path: '/teacher',
    component: Teacher,
    children: [{
        path: 'noticeSend',
        component: SendNotice
      },
      {
        path: 'leave',
        component: Leave
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/student',
    component: Student,
    children: [{
        path: 'application',
        component: Application
      },
      {
        path: 'healthTable',
        component: HealthTable
      },
      {
        path: 'myNotice',
        component: MyNotice
      },
      {
        path: 'user',
        component: User
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
