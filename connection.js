const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aivista.co.in/sof/';

export const GET_APIS = {
  subjectsdataurl: `${BASE_URL}CommonFeatuersMicroservices/subjects`,
  child_performance_track: `${BASE_URL}ParentsMicroservices/performance_monitor`,
  aiinsightsurl: `${BASE_URL}ChildMicroservices/ai_insights`,
  selfpracticedashboardurl: `${BASE_URL}ChildMicroservices/self_practice_dashboard`,
  adminstudentdashboardurl: `${BASE_URL}AdminMicroservices/admin_students_dashboard`,
  adminparentdashboardurl: `${BASE_URL}AdminMicroservices/admin_parents_dashboard`,
  fetchparents: `${BASE_URL}AdminMicroservices/fetch_parents`,
  testanalyticsadmin: `${BASE_URL}AdminMicroservices/test_analytics`,
};

export const POST_APIS = {
  register: `${BASE_URL}ParentsMicroservices/register`,
  login: `${BASE_URL}AuthMicroservices/login`,
  addChild: `${BASE_URL}ParentsMicroservices/add_child`,
  testresult: `${BASE_URL}ChildMicroservices/test_result`,
  childdetails: `${BASE_URL}ParentsMicroservices/get_child_details`,
  generatetest: `${BASE_URL}ChildMicroservices/generate_test`,
  assigntest: `${BASE_URL}ParentsMicroservices/assign_test`,
  updatechilddetails: `${BASE_URL}ParentsMicroservices/update_child_details`,
  startassessment: `${BASE_URL}AssessmentMicroservices/start_assessment`,
  saveanswer: `${BASE_URL}AssessmentMicroservices/save_answer`,
  submitassessment: `${BASE_URL}AssessmentMicroservices/submit`,
  smartassistantchat: `${BASE_URL}ParentsMicroservices/smart_assistant`,
  adminaddparent: `${BASE_URL}AdminMicroservices/admin_add_parent`,
  studymetadatadashboardurl: `${BASE_URL}AdminMicroservices/study_metadata`,
  adminuploadprocess: `${BASE_URL}AdminMicroservices/upload_process`,
  adminaddchild: `${BASE_URL}AdminMicroservices/admin_add_child`,
  assigntestadmin: `${BASE_URL}AdminMicroservices/assign_test_admin `,
  forgot_password_sent_otp: `${BASE_URL}AuthMicroservices/forgot_password_sent_otp `,
  reset_password_usingotp: `${BASE_URL}AuthMicroservices/reset_password_usingotp `,
  change_password_using_email: `${BASE_URL}AuthMicroservices/change_password_using_email `,
};

export const PUT_APIS = {
  adminupdateparent: `${BASE_URL}AdminMicroservices/edit_parent`,
  admineditchild: `${BASE_URL}AdminMicroservices/edit_child`,
};

export const DELETE_APIS = {
  deletechild: `${BASE_URL}ParentsMicroservices/delete_child`,
};
