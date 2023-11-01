import React, { Component,Suspense, lazy, useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Context } from '../auth/Context';

import Spinner from '../app/shared/Spinner';
import CauseList from './dashboard/causeList/CauseListWithSister';
import CauseListCounsel from './dashboard/causeList/CauseListCounselWithSister';
const Appellants =lazy(()=>import('./dashboard/appellants/Appellants'))


const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const NewUser =lazy(()=> import('./dashboard/users/NewUser'));
const Users =lazy(()=> import('./dashboard/users/Users'));
const AllCases =lazy(()=> import('./dashboard/cases/AllCases'));
const AllCaseTypes =lazy(()=> import('./dashboard/caseTypes/AllCaseTypes'))
const NewCaseType =lazy(()=>import('./dashboard/caseTypes/NewCaseType'))
const CasePerDay =lazy(()=>import('./dashboard/maximumCase/CasePerDay'))
const UsersCase = lazy(()=> import('./dashboard/cases/UsersCase'))
const UserCases = lazy(()=> import('./dashboard/cases/AllCases'))
const NewCase = lazy(()=> import('./dashboard/cases/NewCase'))
const CaseEntry = lazy(()=> import('./dashboard/cases/CaseEntry'))

//role management
const Roles = lazy(()=> import('./dashboard/roleManagement/Roles'))
const Module = lazy(()=> import('./dashboard/roleManagement/Module'))
const SubModules = lazy(()=> import('./dashboard/roleManagement/SubModule'))
const AssignModule = lazy(()=> import('./dashboard/roleManagement/AssignModule'))





const SingleCase = lazy(()=> import('./dashboard/cases/SingleCase'))
const Holidays =lazy(()=>import('./dashboard/Holidays/Holidays'))
const Justices =lazy(()=>import('./dashboard/Justices/Justices'))
const AssignedJustices =lazy(()=> import('./dashboard/Justices/AssignedJustices'))


const NewAssignedJustices =lazy(()=> import('./dashboard/Justices/NewAssignedJusticeList.js'))
const NewDeactivateJustice =lazy(()=> import('./dashboard/Justices/NewDeactivateJustice'))


const JusticeDateList =lazy(()=> import('./dashboard/Justices/JusticeDateList'))
const DeactivateJustice =lazy(()=> import('./dashboard/Justices/DeactivateJustice'))
// const CaseJusticeList =lazy(()=>import('./dashboard/Justices/CaseJusticeList'))
// const CaseJusticesList =lazy(()=> import('./dashboard/Justices/CaseJusticeList.JS'))



const AssignedJusticeList =lazy(()=> import('./dashboard/Justices/AssignedJusticeList'))
const JusticeDisqualifications =lazy(()=> import('./dashboard/Justices/JusticeDisqualifications'))
const NewJusticeDisqualifications =lazy(()=> import('./dashboard/Justices/NewJusticeDisqualification.js'))


const CreateHoliday = lazy(()=> import('./dashboard/Holidays/CreateHoliday'))

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));


const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));



const Mdi = lazy(() => import('./icons/Mdi'));


const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const ForgotPassword = lazy(() => import('./user-pages/ForgotPassword'));
const ResetPassord = lazy(() => import('./user-pages/ResetPassword'));
const Register1 = lazy(() => import('./user-pages/Register'));
const Lockscreen = lazy(() => import('./user-pages/Lockscreen'));

const BlankPage = lazy(() => import('./general-pages/BlankPage'));





const AppRoutes = () => {
  const { user, dispatch } = useContext(Context);
  const isAuthenticated = user !== null; // Update this condition based on your authentication logic
  
  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
      <Route path="/forgetpassword" component={ForgotPassword} />
      <Route path="/login" component={Login} />
      <Route path="/reset-password" component={ResetPassord} />

      
      
     
  
        {/* Add this condition before rendering each protected route */}
        {isAuthenticated ? (
          <>
           <Route path="/dashboard" component={Dashboard} />
            <Route path="/basic-ui/buttons" component={Buttons} />
            <Route path="/new-user" component={NewUser} />
            <Route path="/users" component={Users} />
            <Route path="/all-case" component={AllCases} />
            <Route path="/cause-list" component={CauseList} />
            <Route path="/cause-list-counsel" component={CauseListCounsel} />
            <Route path="/case-types" component={AllCaseTypes} />
            <Route path="/new-case-type" component={NewCaseType} />
            <Route path="/case-limit" component={CasePerDay} />
            <Route path="/users-cases" component={UsersCase} />
            <Route path="/case/:id" component={SingleCase} />
            <Route path="/add-case" component={NewCase} />
            <Route path="/case-entry" component={CaseEntry} />

            <Route path="/edit-case/:caseId" component={NewCase} />
            <Route path="/user-case/:id" component={SingleCase} />
            <Route path="/appellants" component={Appellants} />


            <Route path="/role" component={Roles} />
            <Route path="/module-list" component={Module} />
            <Route path="/submodule-list" component={SubModules} />
            <Route path="/assign-module-to-role" component={AssignModule} />




            

            <Route path="/Create-holiday" component={CreateHoliday} />
            <Route path="/holidays" component={Holidays} />
            <Route path="/justices" component={Justices} />
            <Route path="/assign-justices" component={AssignedJustices} />
            <Route path="/new-assign-justices" component={NewAssignedJustices} />
            <Route path="/new-deactivate-justices" component={NewDeactivateJustice} />


            <Route path="/assign-justices-list" component={AssignedJusticeList} />
            <Route path="/assigned-justices-date-list" component={JusticeDateList} />
            <Route path="/deactivate-justice" component={DeactivateJustice} />
            {/* <Route path="/case-justice-list" component={CaseJusticeList} /> */}


            <Route path="/justices-disqualifications" component={JusticeDisqualifications} />
            <Route path="/new-justices-disqualifications" component={NewJusticeDisqualifications} />


            

  
            <Route path="/basic-ui/dropdowns" component={Dropdowns} />
            <Route path="/basic-ui/typography" component={Typography} />
  
            <Route path="/form-Elements/basic-elements" component={BasicElements} />
  
            <Route path="/tables/basic-table" component={BasicTable} />
  
            <Route path="/icons/mdi" component={Mdi} />
  
            <Route path="/charts/chart-js" component={ChartJs} />
  
            <Route path="/user-pages/login-1" component={Login} />
            <Route path="/user-pages/register-1" component={Register1} />
            <Route path="/user-pages/lockscreen" component={Lockscreen} />
  
            <Route path="/error-pages/error-404" component={Error404} />
            <Route path="/error-pages/error-500" component={Error500} />
  
           
          </>
        ) : (
          <Redirect to="/login" />
        )}
   <Route path="/general-pages/blank-page" component={BlankPage} />
        {/* If none of the above routes match, redirect to the login page */}
        {/* <Redirect to="/general-pages/blank-page" /> */}
      </Switch>
    </Suspense>
  );
  
};

export default AppRoutes;