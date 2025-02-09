const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const crypto = require('crypto');
const sha1 = require('sha1');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const nodemailer = require('nodemailer');
app.use(bodyParser.json({ limit: '10000mb' }));
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));



const db = require('../connection/config/database');

console.log(db, 'db')

const transporter = nodemailer.createTransport({
  host: 'mail.urbanitsolution.com',
  port: 587,
  secure: false,
  auth: {
    user: 'saklain@urbanitsolution.com',
    pass: 'saklain',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/send-otp/email', async (req, res) => {
  try {
    const { email, msg, otp } = req.body;
    // const otp = generateRandomOTP();

    const saveOtpQuery = 'UPDATE users SET email_verifiy_code = ? WHERE email = ?';
    await db.query(saveOtpQuery, [otp, email]);


    const mailOptions = {
      from: `saklain@urbanitsolution.com`,
      to: email,
      subject: 'OTP Verification',
      text: msg || `Your OTP is ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to send OTP via email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function generateRandomOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const puppeteer = require('puppeteer');
app.post('/convertToPDF', async (req, res) => {
  const { url } = req.body;

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Create a new page
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Generate a PDF buffer
    const pdfBuffer = await page.pdf();

    // Close the browser
    await browser.close();

    // Set the content type and send the PDF buffer as the response
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error converting to PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// http://192.168.0.107:5002/allUsers?email=abutaher01725@gmail.com
const usersModel = require('../app/model/Admin/usersListModel')
app.get('/user/allUser', usersModel.users_list)
app.get('/user/allUser/:id', usersModel.users_single)
app.get('/users', usersModel.users_controller)
app.get('/users/add', usersModel.addColumn)
app.get('/users/role_all', usersModel.role_list)
app.post('/send-otp', usersModel.send_users_number_otp)
// app.post('/send-otp/email', usersModel.emailOtpSend)
app.delete('/allUser/:id', usersModel.users_delete)
app.post('/updateUsers/:id', usersModel.users_edit)
app.put('/update/verification_code/:id', usersModel.UpdateSingleUserMobileVerificationCode)
app.put('/update/verification_code_email/:id', usersModel.UpdateSingleUserEmailVerificationCode)
app.get('/allUsers', usersModel.users_list_email_wise)
app.post('/login', usersModel.users_login);
app.post('/create-users', usersModel.users_create);
app.post('/admin/create_side_menu', usersModel.side_menu_create);
app.get('/Admin/side_menu/font_family_list', usersModel.font_family_list);
app.put('/admin/update_side_menu/:id', usersModel.side_menu_update);
app.put('/admin/reset_password/:id', usersModel.password_reset);
app.put('/updateLogin/:email', usersModel.updateLogin);



app.get('/menu_item/all', usersModel.menu_Item_list)
app.post('/menu_item/create', usersModel.menu_Item_create)
app.get('/admin_template_table/create', usersModel.admin_template_menu_table_create)
app.delete('/admin_template_table/delete/:id', usersModel.admin_template_menu_delete)
app.put('/admin_template_table/update/:id', usersModel.admin_template_menu_update)
app.delete('/admin_template_table/delete_all', usersModel.menu_item_delete_all)
app.post('/admin_template_table/post_all_data', usersModel.menu_item_create_bulk)
app.get('/page-group/display-name', usersModel.page_group_display_name_list);
app.post('/admin/users_role/users_role_access_update/:id', usersModel.users_role_access_update)

// role

app.post('/user/user-role-create', usersModel.users_role_create);
app.post('/Admin/user/users_role_access_create', usersModel.users_role_access_create);
app.get('/user/user-role-single/:id', usersModel.users_role_single);
app.put('/user/user-role/edit/:id', usersModel.users_role_update);
app.delete('/user/user-role/delete/:id', usersModel.users_role_delete);
app.get('/user/role', usersModel.users_role_permission_list);
app.get('/user-role/btn', usersModel.usersRoleBtn);


const adminPageList = require('../app/model/Admin/module_info/adminPageListModel')
app.get('/admin/allAdmin', adminPageList.getAllAdminPageList)

app.get('/admin/admin_panel_settings', adminPageList.admin_panel_settings_list)
app.get('/admin/admin_panel_settings/:id', adminPageList.admin_panel_settings_single)
app.get('/download/:columnName', adminPageList.getSingleAdminPanelSettingsDownload)
app.delete('/admin/admin_panel_settings/delete/:id', adminPageList.admin_panel_settings_delete)

app.get('/admin/module_info/module_info_all/:id/role', adminPageList.module_info_list_list)




app.get('/admin/allAdmin/:id', adminPageList.module_info_single)
app.delete('/admin/allAdmin/:id', adminPageList.module_info_delete)
app.post('/admin/delete/:id', adminPageList.module_info_delete)


const ModuleInfo = require('../app/model/Admin/module_info/moduleInfo')
app.post('/admin/allAdmin/', ModuleInfo.module_info_create)

app.post('/admin/copy/', ModuleInfo.module_info_copy)
app.post('/updateAdminList/:id', ModuleInfo.module_info_update)
app.delete('/admin/allAdmin/:id', ModuleInfo.module_info_delete)
app.get("/Pagination/:pageNo/:perPage", ModuleInfo.module_info_list_paigination);
app.post('/admin/module_info/delete/:id', ModuleInfo.module_info_delete)
app.get('/admin/module_info/module_info_tutorial_all', ModuleInfo.module_info_tutorial_all)
app.post('/admin/module_info/module_info_tutorial_update', ModuleInfo.module_info_tutorial_update)
// app.get('/admin/module_info/module_info_tutorial_single/:id', ModuleInfo.module_info_tutorial_single)
app.get('/admin/module_info/module_info_tutorial_all_paigination/:pageNo/:perPage', ModuleInfo.module_info_tutorial_all_paigination)



app.get('/Admin/user_role_access/module_info_all_access', adminPageList.getPageGroupAndDisplayNameWithId )
app.get('/page-group/display-name/with-id', adminPageList.getPageGroupAndDisplayNameWithIdAccess)
app.get('/admin/allAdmin/', ModuleInfo.getAllAdminPageList)
app.get('/admin/module_info/module_info_all/:id', ModuleInfo.getAllAdminPageLists)
app.get('/admin/group-names-id', ModuleInfo.getPageGroupAndControllerNamesId)
app.get('/admin/users_role/users_role_permission/:id', ModuleInfo.users_role_permission_default_page)





const faIcons = require('../app/model/Admin/faIconsModel')
app.get('/faIcons', faIcons.getAllIconList)


const brandModel = require('../app/model/Admin/brand_model/brand_model')

app.get('/Admin/brand/brand_all/:pageNo/:perPage', brandModel.brand_list_paigination)
app.get('/Admin/brand/brand_all', brandModel.brand_list)
app.post('/Admin/brand/brand_create', brandModel.brand_create)
app.post('/admin/brand/brand_delete/:id', brandModel.brand_delete)
app.get('/admin/brand/brand_all/:id', brandModel.brand_single)
app.post('/admin/brand/brand_edit/:id', brandModel.brand_update)
app.post('/Admin/brand/brand_search', brandModel.brand_search)
app.post('/Admin/brand/brand_copy', brandModel.brand_copy)
app.post('/Admin/brand/brand_pdf', brandModel.brand_pdf)
app.get('/status/all_status', brandModel.ListStatus)



const categoryModel = require('../app/model/Admin/category_model/category_model')
app.post('/Admin/category/category_create', categoryModel.category_create)
app.get('/Admin/category/category_all', categoryModel.category_list)
app.get('/Admin/category/category_all/:id', categoryModel.category_single)
app.post('/Admin/category/category_edit/:id', categoryModel.category_update)
app.post('/Admin/category/category_delete/:id', categoryModel.category_delete)
app.get('/Admin/category/category_all/:pageNo/:perPage', categoryModel.category_list_paigination)
app.post('/Admin/category/category_search', categoryModel.category_search)
app.post('/Admin/category/category_copy', categoryModel.category_copy)
app.post('/Admin/category/category_pdf', categoryModel.category_pdf)

const colorModel = require('../app/model/Admin/color_model/color_model')
app.post('/Admin/color/color_create', colorModel.color_create)
app.get('/Admin/color/color_all', colorModel.color_list)
app.get('/Admin/color/color_all/:id', colorModel.color_single)
app.post('/Admin/color/color_edit/:id', colorModel.color_update)
app.post('/Admin/color/color_delete/:id', colorModel.color_delete)
app.post('/Admin/color/color_search', colorModel.color_search)
app.get('/Admin/color/color_all/:pageNo/:perPage', colorModel.color_list_paigination)
app.post('/Admin/color/color_copy', colorModel.color_copy)
app.post('/Admin/color/color_pdf', colorModel.color_pdf)


const subCategoryModel = require('../app/model/Admin/sub_category_model/sub_category_model')
app.post('/Admin/sub_category/sub_category_create', subCategoryModel.sub_category_create)
app.get('/Admin/sub_category/sub_category_all', subCategoryModel.sub_category_list)
app.get('/Admin/sub_category/sub_category_all/:id', subCategoryModel.sub_category_single)
app.post('/Admin/sub_category/sub_category_edit/:id', subCategoryModel.sub_category_update)
app.post('/Admin/sub_category/sub_category_delete/:id', subCategoryModel.sub_category_delete)
app.post('/Admin/sub_category/sub_category_search', subCategoryModel.sub_category_search)
app.get('/Admin/sub_category/sub_category_all/:pageNo/:perPage', subCategoryModel.sub_category_list_paigination)
app.post('/Admin/sub_category/sub_category_copy', subCategoryModel.sub_category_copy)
app.post('/Admin/sub_category/sub_category_pdf', subCategoryModel.sub_category_pdf)



const materialModel = require('../app/model/Admin/material_model/material_model')
app.post('/Admin/material/material_create', materialModel.material_create)
app.get('/Admin/material/material_all', materialModel.material_list)
app.get('/Admin/material/material_all/:id', materialModel.material_single)
app.post('/Admin/material/material_edit/:id', materialModel.material_update)
app.post('/Admin/material/material_delete/:id', materialModel.material_delete)
app.post('/Admin/material/material_search', materialModel.material_search)
app.get('/Admin/material/material_all/:pageNo/:perPage', materialModel.material_list_paigination)
app.post('/Admin/material/material_copy', materialModel.material_copy)
app.post('/Admin/material/material_pdf', materialModel.material_pdf)

const typeModel = require('../app/model/Admin/type_model/type_model')
app.post('/Admin/type/type_create', typeModel.type_create)
app.get('/Admin/type/type_all', typeModel.type_list)
app.get('/Admin/type/type_all/:id', typeModel.type_single)
app.post('/Admin/type/type_edit/:id', typeModel.type_update)
app.post('/Admin/type/type_delete/:id', typeModel.type_delete)
app.post('/Admin/type/type_search', typeModel.type_search)
app.get('/Admin/type/type_all/:pageNo/:perPage', typeModel.type_list_paigination)
app.post('/Admin/type/type_copy', typeModel.type_copy)
app.post('/Admin/type/type_pdf', typeModel.type_pdf)


const modelModel = require('../app/model/Admin/model_model/model_model')
app.post('/Admin/model/model_create', modelModel.model_create)
app.get('/Admin/model/model_all', modelModel.model_list)
app.get('/Admin/model/model_all/:id', modelModel.model_single)
app.post('/Admin/model/model_edit/:id', modelModel.model_update)
app.post('/Admin/model/model_delete/:id', modelModel.model_delete)
app.post('/Admin/model/model_search', modelModel.model_search)
app.get('/Admin/model/model_all/:pageNo/:perPage', modelModel.model_list_paigination)
app.post('/Admin/model/model_copy', modelModel.model_copy)
app.post('/Admin/model/model_pdf', modelModel.model_pdf)



const periodModel = require('../app/model/Admin/period_model/period_model')
app.post('/Admin/period/period_create', periodModel.period_create)
app.get('/Admin/period/period_all', periodModel.period_list)
app.get('/Admin/period/period_all/:id', periodModel.period_single)
app.post('/Admin/period/period_edit/:id', periodModel.period_update)
app.post('/Admin/period/period_delete/:id', periodModel.period_delete)
app.post('/Admin/period/period_search', periodModel.period_search)
app.get('/Admin/period/period_all/:pageNo/:perPage', periodModel.period_list_paigination)
app.post('/Admin/period/period_copy', periodModel.period_copy)
app.post('/Admin/period/period_pdf', periodModel.period_pdf)


const unitModel = require('../app/model/Admin/unit_model/unit_model')
app.post('/Admin/unit/unit_create', unitModel.unit_create)
app.get('/Admin/unit/unit_all', unitModel.unit_list)
app.get('/Admin/unit/unit_all/:id', unitModel.unit_single)
app.post('/Admin/unit/unit_edit/:id', unitModel.unit_update)
app.post('/Admin/unit/unit_delete/:id', unitModel.unit_delete)
app.post('/Admin/unit/unit_search', unitModel.unit_search)
app.get('/Admin/unit/unit_all/:pageNo/:perPage', unitModel.unit_list_paigination)
app.post('/Admin/unit/unit_copy', unitModel.unit_copy)
app.post('/Admin/unit/unit_pdf', unitModel.unit_pdf)


const warrantyModel = require('../app/model/Admin/warranty_model/warranty_model')
app.post('/Admin/warranty/warranty_create', warrantyModel.warranty_create)
app.get('/Admin/warranty/warranty_all', warrantyModel.warranty_list)
app.get('/Admin/warranty/warranty_all/:id', warrantyModel.warranty_single)
app.post('/Admin/warranty/warranty_edit/:id', warrantyModel.warranty_update)
app.post('/Admin/warranty/warranty_delete/:id', warrantyModel.warranty_delete)
app.post('/Admin/warranty/warranty_search', warrantyModel.warranty_search)
app.get('/Admin/warranty/warranty_all/:pageNo/:perPage', warrantyModel.warranty_list_paigination)
app.post('/Admin/warranty/warranty_copy', warrantyModel.warranty_copy)
app.post('/Admin/warranty/warranty_pdf', warrantyModel.warranty_pdf)


const productModel = require('../app/model/Admin/product_model/product_model');

app.post('/Admin/product/product_quick_create', productModel.create_quick_product);
app.post('/Admin/product/quick_brand_search', productModel.quick_brand_search);
app.post('/Admin/product/quick_brand_update', productModel.quick_brand_update);
app.post('/Admin/product/product_delete/:id', productModel.product_delete);


app.post('/Admin/product/barcode_print', productModel.barcode_print);
app.post('/Admin/product/barcode_print_single', productModel.barcode_print_single);
app.post('/Admin/product/barcode_pdf', productModel.barcode_pdf);
app.post('/Admin/product/barcode_pdf_single', productModel.barcode_pdf_single);



app.post('/Admin/product/quick_category_search', productModel.quick_category_search);
app.post('/Admin/product/quick_category_update', productModel.quick_category_update);
app.post('/Admin/product/product_pdf', productModel.product_pdf);
app.post('/Admin/product/product_copy', productModel.product_copy);
app.get('/Admin/product/max_barcode_product_list', productModel.max_barcode_product_list);

app.post('/Admin/product/product_create', productModel.product_create);
app.post('/Admin/product/product_search', productModel.product_search)
app.get('/Admin/product/product_list', productModel.product_list)
app.post('/Admin/product/product_edit/:id', productModel.product_update)
app.get('/Admin/product/product_list/:id', productModel.product_single)
app.get('/Admin/product/product_list/:pageNo/:perPage', productModel.product_list_paigination)
app.post('/Admin/product/product_image_settings/product_image_settings_create', productModel.
  product_image_settings)


const schoolShift = require('../app/model/Admin/school_shift/school_shiftt')
app.post('/Admin/school_shift/school_shift_create', schoolShift.school_shiftt_create)
app.get('/Admin/school_shift/school_shift_all', schoolShift.school_shift_list)
app.post('/Admin/school_shift/school_shift_delete/:id', schoolShift.school_shift_delete)
app.get('/Admin/school_shift/school_shift_all/:id', schoolShift.school_shift_single)
app.post('/Admin/school_shift/school_shift_edit/:id', schoolShift.school_shift_update)
app.get('/Admin/school_shift/school_shift_all/:pageNo/:perPage', schoolShift.school_shift_list_paigination)


const payRoll = require('../app/model/Admin/pay_roll_model/pay_roll_model')
app.post('/Admin/pay_roll/pay_roll_create', payRoll.payroll_create)
app.get('/Admin/pay_roll/pay_roll_all', payRoll.payroll_list)
app.post('/Admin/pay_roll/pay_roll_delete/:id', payRoll.payroll_delete)
app.post('/Admin/pay_roll/pay_roll_edit/:id', payRoll.payroll_update)
app.get('/Admin/pay_roll/pay_roll_all/:id', payRoll.payroll_single)
app.get('/Admin/pay_roll/pay_roll_list/:pageNo/:perPage', payRoll.payroll_list_paigination)

const EmployeeModel = require('../app/model/Admin/employee_model/employee_model')
app.get('/Admin/education/education_list', EmployeeModel.education_name_list)
app.get('/Admin/divisions/divisions_list', EmployeeModel.divisions_list)
app.get('/Admin/district/district_list', EmployeeModel.districts_list)
app.get('/Admin/upazilas/upazilas_list', EmployeeModel.upazilas_list)
app.post('/Admin/employee/employee_create', EmployeeModel.create_employee)
// app.get('/Admin/employee/employee_all', EmployeeModel.employee_list)
app.post('/Admin/employee/employee_delete/:id', EmployeeModel.employee_delete)
// app.post('/Admin/employee/employee_edit/:id', EmployeeModel.update_employee)
app.post('/Admin/employee/employee_edit/:id', EmployeeModel.employee_update)
app.get('/Admin/employee/employee_list', EmployeeModel.employee_all)
app.get('/Admin/employee/employee_list/:id', EmployeeModel.employee_all_single)
app.get('/Admin/employee/employee_list_for_attendance', EmployeeModel.employee_all_for_attendance)
app.post('/Admin/employee_user/employee_user_update/:id', EmployeeModel.user_update)
app.get('/Admin/designation/designation_list', EmployeeModel.designation_list)
app.get('/Admin/gender/gender_list', EmployeeModel.gender_list)
app.get('/Admin/religion/religion_list', EmployeeModel.religion_list)
app.post('/Admin/employee/quick_create_employee', EmployeeModel.quick_create_employee)
app.post('/Admin/employee/employee_promotion_create/:id', EmployeeModel.employee_promotion_create)
app.get('/Admin/employee/employee_geo/:id', EmployeeModel.employee_geo)
app.get('/Admin/employee/employee_list_role_wise', EmployeeModel.employee_list_role_wise)
app.post('/Admin/location/location_search', EmployeeModel.employee_location_search)
app.post('/Admin/location/location_pdf', EmployeeModel.employee_location_pdf)
app.get('/Admin/location/geo_location_all/:id', EmployeeModel.employee_geo_location_all)
app.get('/Admin/location/geo_location_all_live/:id', EmployeeModel.employee_geo_location_all_current_date)
app.get('/Admin/employee/employee_all_list', EmployeeModel.employee_all_list)
app.get('/Admin/employee/employee_all_list_settings', EmployeeModel.employee_all_list_settings)
app.get('/Admin/employee/employee_all_list/:id', EmployeeModel.employee_all_list_single)
app.post('/Admin/employee/employee_search', EmployeeModel.employee_search)
app.get('/Admin/employee/employee_list_paigination/:pageNo/:perPage', EmployeeModel.employee_list_paigination)
app.post('/Admin/employee/employee_list_pdf', EmployeeModel.employee_pdf)
app.post('/Admin/employee/employee_list_print', EmployeeModel.employee_list_print)
app.get('/Admin/employee/employee_id_card_setting_list', EmployeeModel.employee_id_card_setting_list)
app.get('/Admin/employee/employee_id_card_setting_back_list', EmployeeModel.employee_id_card_setting_back_list)
app.post('/Admin/employee/employee_id_card_all_create', EmployeeModel.employee_id_card_all_create)
app.post('/Admin/employee/employee_id_card_setting_delete/:id', EmployeeModel.employee_id_card_setting_delete)



const CompanyModel = require('../app/model/Admin/company_model/company_model')
app.post('/Admin/company/company_create', CompanyModel.company_create)
app.get('/Admin/company/company_all', CompanyModel.company_list)
app.post('/Admin/company/company_edit/:id', CompanyModel.company_update)
app.get('/Admin/company/company_all/:id', CompanyModel.company_single)
app.post('/Admin/company/company_delete/:id', CompanyModel.company_delete)
app.get('/Admin/company/company_list/:pageNo/:perPage', CompanyModel.company_list_paigination)

const BranceModel = require('../app/model/Admin/brance_model/brance_model')
app.get('/Admin/company_type/company_type_all', BranceModel.company_type_list)
app.get('/Admin/branch/branch_all', BranceModel.brance_list)
app.post('/Admin/branch/branch_create', BranceModel.branch_create)
app.get('/Admin/branch/branch_all/:id', BranceModel.branch_single)
app.post('/Admin/branch/branch_edit/:id', BranceModel.branch_update)
app.post('/Admin/branch/branch_delete/:id', BranceModel.branch_delete)
app.get('/Admin/branch/branch_list/:pageNo/:perPage', BranceModel.branch_list_paigination)

const MobileAllwoanceModel = require('../app/model/Admin/mobile_allowance_model/mobile_allowance_model')
app.post('/Admin/mobile_allowance/mobile_allowance_create', MobileAllwoanceModel.mobile_allowance_create)
app.get('/Admin/mobile_allowance/mobile_allowance_all', MobileAllwoanceModel.mobile_allowance_list)
app.get('/Admin/mobile_allowance/mobile_allowance_all/:id', MobileAllwoanceModel.mobile_allowance_single)
app.post('/Admin/mobile_allowance/mobile_allowance_edit/:id', MobileAllwoanceModel.mobile_allowance_update)
app.post('/Admin/mobile_allowance/mobile_allowance_delete/:id', MobileAllwoanceModel.mobile_allowance_delete)
app.get('/Admin/mobile_allowance/mobile_allowance_list/:pageNo/:perPage', MobileAllwoanceModel.mobile_allowance_list_paigination)


const TransportAllwoanceModel = require('../app/model/Admin/transport_allowance_model/transport_allowance_model')

app.post('/Admin/transport_allowance/transport_allowance_create', TransportAllwoanceModel.transport_allowance_create)
app.get('/Admin/transport_allowance/transport_allowance_all', TransportAllwoanceModel.transport_allowance_list)
app.post('/Admin/transport_allowance/transport_allowance_edit/:id', TransportAllwoanceModel.transport_allowance_update)
app.get('/Admin/transport_allowance/transport_allowance_all/:id', TransportAllwoanceModel.transport_allowance_single)
app.post('/Admin/transport_allowance/transport_allowance_delete/:id', TransportAllwoanceModel.mobile_allowance_delete)
app.get('/Admin/transport_allowance/transport_allowance_list/:pageNo/:perPage', TransportAllwoanceModel.transport_allowance_list_paigination)


const OfficeVisitModel = require('../app/model/Admin/office_visit_model/office_visit_model')

app.post('/Admin/office_visit/office_visit_create', OfficeVisitModel.office_visit_creates)
app.get('/Admin/office_visit/office_visit_all/:id', OfficeVisitModel.office_visit_single)
app.get('/Admin/office_visit/office_visit_all', OfficeVisitModel.office_visit_list)
app.post('/Admin/office_visit/office_visit_remarks_create', OfficeVisitModel.office_visit_remarks_create)
app.post('/Admin/office_visit/office_visit_person_create', OfficeVisitModel.office_visit_person_create)
app.post('/Admin/office_visit/office_visit_delete/:id', OfficeVisitModel.office_visit_delete)
app.get('/Admin/office_visit/office_visit_list_single/:id', OfficeVisitModel.office_visit_list_single)
app.post('/Admin/office_visit/office_visit_edit/:id', OfficeVisitModel.office_visit_list_single_update)
app.get('/Admin/office_visit/office_visit_list/:pageNo/:perPage', OfficeVisitModel.office_visit_list_paigination)
app.get('/Admin/office_visit/office_visit_remarks_list/:id', OfficeVisitModel.office_visit_remarks_single)
app.get('/Admin/office_visit/office_visit_person_list/:id', OfficeVisitModel.office_visit_person_single)
app.post('/Admin/office_visit/office_visit_remarks_edit/:id', OfficeVisitModel.office_visit_remarks_update)
app.post('/Admin/office_visit/office_visit_person_edit/:id', OfficeVisitModel.office_visit_person_update)
app.post('/Admin/office_visit/office_visit_remarks_delete/:id', OfficeVisitModel.office_visit_remarks_delete)
app.post('/Admin/office_visit/office_visit_person_delete/:id', OfficeVisitModel.office_visit_person_delete)
app.get('/Admin/office_visit/office_visit_person_list/:pageNo/:perPage/:id', OfficeVisitModel.office_visit_person_list_pagination)
app.get('/Admin/office_visit/office_visit_remarks_list/:pageNo/:perPage/:id', OfficeVisitModel.office_visit_remarks_list_pagination)
app.get('/Admin/office_visit/office_visit_person_list_visit/:id', OfficeVisitModel.office_visit_person_single_visit)
app.get('/Admin/office_visit/office_visit_remarks_list_visit/:id', OfficeVisitModel.office_visit_remarks_single_visit)
app.post('/Admin/office_visit/office_visit_person_list_pdf', OfficeVisitModel.office_visit_person_pdf)
app.post('/Admin/office_visit/office_visit_remarks_list_pdf', OfficeVisitModel.office_visit_remarks_pdf)
app.post('/Admin/office_visit/office_visit_person_list_print', OfficeVisitModel.office_visit_person_print)
app.post('/Admin/office_visit/office_visit_remarks_list_print', OfficeVisitModel.office_visit_remarks_print)
app.post('/Admin/office_visit/office_visit_remarks_search/:id', OfficeVisitModel.office_visit_remarks_search)
app.post('/Admin/office_visit/office_visit_person_search/:id', OfficeVisitModel.office_visit_person_search)


const expenceCategoryModel = require(`../app/model/Admin/expense_category_model/expense_category_model`)
app.post('/Admin/expence_category/expence_category_create', expenceCategoryModel.expence_category_create);
app.get('/Admin/expence_category/expence_category_all', expenceCategoryModel.expence_category_list);
app.get('/Admin/expence_category/expence_category_all/:id', expenceCategoryModel.expense_category_single);
app.post('/Admin/expence_category/expence_category_edit/:id', expenceCategoryModel.expense_category_update);
app.post('/Admin/expence_category/expence_category_delete/:id', expenceCategoryModel.expense_category_delete);
app.get('/Admin/expence_category/expence_category_list_paigination/:pageNo/:perPage', expenceCategoryModel.expense_category_list_paigination);


const expenceModel = require(`../app/model/Admin/expense_model/expense_model`)
app.post('/Admin/expense/expense_create', expenceModel.expence_create)
app.post('/Admin/expense/expense_single_pdf', expenceModel.expense_single_pdf)
app.post('/Admin/expense/expense_search', expenceModel.expense_search)
app.get('/Admin/expense/expense_list/:pageNo/:perPage', expenceModel.expense_list_paigination)
app.get('/Admin/expense/expense_list', expenceModel.expence_category_list)
app.post('/Admin/expense/expense_delete/:id', expenceModel.expense_delete)
app.get('/Admin/expense/expense_all', expenceModel.expense_get)
app.get('/Admin/expense/expense_all/:id', expenceModel.expense_getById)
app.post('/Admin/expense/expense_update/:id', expenceModel.expense_update)
app.post('/Admin/expense/expense_pdf', expenceModel.expense_pdf)



const income_category_model = require(`../app/model/Admin/income_category_model/income_category_model`)
app.post('/Admin/income_category/income_category_create', income_category_model.income_category_create);
app.get('/Admin/income_category/income_category_all', income_category_model.income_category_list);
app.get('/Admin/income_category/income_category_all/:id', income_category_model.income_category_single);
app.post('/Admin/income_category/income_category_edit/:id', income_category_model.income_category_update);
app.post('/Admin/income_category/income_category_delete/:id', income_category_model.income_category_delete);
app.get('/Admin/income_category/income_category_list_paigination/:pageNo/:perPage', income_category_model.income_category_list_paigination);


const incomeModel = require(`../app/model/Admin/income_model/income_model`);
app.post('/Admin/income/income_create', incomeModel.income_create);
app.get('/Admin/income/income_list', incomeModel.income_category_list);
app.post('/Admin/income/income_search', incomeModel.income_search);
app.get('/Admin/income/income_list/:pageNo/:perPage', incomeModel.income_list_paigination);
app.post('/Admin/income/income_delete/:id', incomeModel.income_delete);
app.get('/Admin/income/income_all', incomeModel.income_get);
app.get('/Admin/income/income_all/:id', incomeModel.income_getById);
app.post('/Admin/income/income_update/:id', incomeModel.income_update);
app.post('/Admin/income/update_income_amount', incomeModel.update_income_amount);



const supplierModel = require(`../app/model/Admin/supplier_model/supplier_model`)
app.get('/Admin/supplier/supplier_list', supplierModel.supplier_address_list)
app.get('/Admin/supplier/supplier_all/:id', supplierModel.supplier_address_single)
app.post('/Admin/supplier/supplier_edit/:id', supplierModel.supplier_address_update)
app.post('/Admin/supplier/supplier_delete/:id', supplierModel.supplier_address_delete)
app.post('/Admin/supplier/supplier_address_search', supplierModel.supplier_address_search)
app.post('/Admin/supplier/supplier_address_pdf', supplierModel.supplier_address_pdf)
app.post('/Admin/supplier/supplier_address_print', supplierModel.supplier_address_print)
app.get('/Admin/supplier/supplier_list/:pageNo/:perPage', supplierModel.supplier_address_list_paigination)
app.post('/Admin/supplier/supplier_address_create', supplierModel.supplier_address_create)


app.get('/Admin/supplier/due_amount/:supplier_id', supplierModel.supplier_due_amount)


const holidayCategoryModel = require(`../app/model/Admin/holiday_category_model/holiday_category_model`)
app.post('/Admin/holiday_category/holiday_category_create', holidayCategoryModel.holiday_category_create)
app.get('/Admin/holiday_category/holiday_category_all', holidayCategoryModel.holiday_category_list)
app.get('/Admin/holiday_category/holiday_category_all/:id', holidayCategoryModel.holiday_category_single)
app.post('/Admin/holiday_category/holiday_category_edit/:id', holidayCategoryModel.holiday_category_update)
app.post('/Admin/holiday_category/holiday_category_delete/:id', holidayCategoryModel.holiday_category_delete)
app.get('/Admin/holiday_category/holiday_category_list/:pageNo/:perPage', holidayCategoryModel.holiday_category_list_paigination)


const yearlyHolidayModel = require(`../app/model/Admin/yearly_holiday_modal/yearly_holiday_modal`)
app.post('/Admin/yearly_holiday/yearly_holiday_create', yearlyHolidayModel.yearly_holiday_create)
app.get('/Admin/yearly_holiday/yearly_holiday_all', yearlyHolidayModel.yearly_holiday_list)
app.get('/Admin/yearly_holiday/yearly_holiday_all_list', yearlyHolidayModel.yearly_holiday_list_all)
app.get('/Admin/yearly_holiday/yearly_holiday_all_list_id_table', yearlyHolidayModel.yearly_holiday_list_id_table)
app.get('/Admin/yearly_holiday/yearly_holiday_all/:id', yearlyHolidayModel.yearly_holiday_list_single)
app.post('/Admin/yearly_holiday/yearly_holiday_delete/:id', yearlyHolidayModel.yearly_holiday_delete)
app.get('/Admin/yearly_holiday/yearly_holiday_list/:pageNo/:perPage', yearlyHolidayModel.yearly_holiday_list_paigination)
app.post('/Admin/yearly_holiday/yearly_holiday_edit/:id', yearlyHolidayModel.yearly_holiday_update)


const leaveApplicationModel = require(`../app/model/Admin/leave_application_model/leave_application_model`)
app.post('/Admin/leave_application/leave_application_create', leaveApplicationModel.leave_application_create)
app.get('/Admin/leave_application/leave_application_all', leaveApplicationModel.leave_application_list)
app.get('/Admin/leave_application/leave_application_all/:id', leaveApplicationModel.leave_application_single)
app.get('/Admin/leave_application/leave_application_all/:pageNo/:perPage', leaveApplicationModel.leave_application_list_paigination)
app.post('/Admin/leave_application/leave_application_edit/:id', leaveApplicationModel.leave_application_update)
app.post('/Admin/leave_application/leave_application_delete/:id', leaveApplicationModel.leave_application_delete)
app.post('/Admin/leave_application/leave_application_approve', leaveApplicationModel.leave_application_approved)
app.post('/Admin/leave_application/leave_application_search', leaveApplicationModel.leave_application_list_search)
app.get('/Admin/leave_category/leave_category_list', leaveApplicationModel.leave_category_list)
app.post('/Admin/leave_application/leave_application_edit_status/:id', leaveApplicationModel.leave_application_update_status)
app.post('/Admin/leave_application/leave_application_pdf', leaveApplicationModel.leave_application_pdf)

const SalaryModel = require(`../app/model/Admin/salary_model/salary_model`)

app.get('/Admin/salary/salary_all', SalaryModel.employe_joining_list_salary)
app.post('/Admin/salary/salary_search', SalaryModel.employe_joining_list_salary_search)
app.get('/Admin/attendance_all/attendance_all', SalaryModel.employe_attendance_list)
app.get('/Admin/leave_approved/leave_approved_all', SalaryModel.employe_leave_approved_list)
app.post('/Admin/salary/salary_create', SalaryModel.salary_create)
app.get('/Admin/salary/salary_list', SalaryModel.employe_list_salary)
app.post('/Admin/salary/salary_list_search', SalaryModel.employe_list_salary_search)
app.post('/Admin/salary/salary_delete/:id', SalaryModel.salary_delete)
app.get('/Admin/salary/salary_list/:id', SalaryModel.employe_list_salary_single)
app.get('/Admin/salary/salary_details/:id', SalaryModel.employe_list_salary_single_search)
app.post('/Admin/salary/salary_edit/:id', SalaryModel.employee_salary_update)


const AccountHeadTypeModel = require(`../app/model/Admin/account_head_type_model/account_head_type_model`)
app.post('/Admin/account_head_type/account_head_type_create', AccountHeadTypeModel.account_head_type_create)
app.get('/Admin/account_head_type/account_head_type_all', AccountHeadTypeModel.account_head_type_list)
app.get('/Admin/account_head_type/account_head_type_all/:id', AccountHeadTypeModel.account_head_type_single)
app.post('/Admin/account_head_type/account_head_type_delete/:id', AccountHeadTypeModel.account_head_type_delete)
app.post('/Admin/account_head_type/account_head_type_edit/:id', AccountHeadTypeModel.account_head_type_update)
app.get('/Admin/account_head_type/account_head_type_all_paigination/:pageNo/:perPage', AccountHeadTypeModel.account_head_type_list_paigination)


const AccountHeadModel = require(`../app/model/Admin/account_head/account_head_model`)
app.post('/Admin/account_head/account_head_create', AccountHeadModel.account_head_create)
app.get('/Admin/account_head/account_head_all', AccountHeadModel.account_head_list)
app.post('/Admin/account_head/account_head_delete/:id', AccountHeadModel.account_head_delete)
app.get('/Admin/account_head/account_head_all/:id', AccountHeadModel.account_head_single)
app.post('/Admin/account_head/account_head_edit/:id', AccountHeadModel.account_head_update)
app.get('/Admin/account_head/account_head_list', AccountHeadModel.account_head_list_show)
app.get('/Admin/account_head/account_head_list_paigination/:pageNo/:perPage', AccountHeadModel.account_head_list_paigination)

//  Jewel Vai
const GenderModel = require("../app/model/Admin/gender_model/gender_model");
app.post("/Admin/gender/gender_create", GenderModel.gender_create);
app.get("/Admin/gender/gender_all", GenderModel.gender_list);
app.get("/Admin/gender/gender_all/:id", GenderModel.gender_single);
app.post("/Admin/gender/gender_edit/:id", GenderModel.gender_update);
app.post("/Admin/gender/gender_delete/:id", GenderModel.gender_delete);

// list Pagination
app.get(
  "/Admin/gender/gender_list_paigination/:pageNo/:perPage",
  GenderModel.gender_list_paigination
);

const LeaveCategoryModel = require("../app/model/Admin/leave_category_model/leave_category_model.js");

app.post(
  "/Admin/leave_category/leave_category_create",
  LeaveCategoryModel.leave_category_create
);
app.get(
  "/Admin/leave_category/leave_category_all",
  LeaveCategoryModel.leave_category_list
);
app.post(
  "/Admin/leave_category/leave_category_edit/:id",
  LeaveCategoryModel.leave_category_update
);
app.get(
  "/Admin/leave_category/leave_category_all/:id",
  LeaveCategoryModel.leave_category_single
);
app.get(
  "/Admin/leave_category/leave_category_all_paigination/:pageNo/:perPage",
  LeaveCategoryModel.leave_category_list_paigination
);
app.post(
  "/Admin/leave_category/leave_category_delete/:id",
  LeaveCategoryModel.leave_category_delete
);

const BloodGroupModel = require("../app/model/Admin/blood_group_model/blood_group_model.js");

// app.get(
//   "/Admin/blood_group/blood_group_all/:pageNo/:perPage",
//   BloodGroupModel.blood_list_paigination
// );
app.post(
  "/Admin/blood_group/blood_group_create",
  BloodGroupModel.blood_group_create
);
app.get("/Admin/blood_group/blood_group_all", BloodGroupModel.blood_group_list);
app.post(
  "/Admin/blood_group/blood_group_edit/:id",
  BloodGroupModel.blood_group_update
);
app.get(
  "/Admin/blood_group/blood_group_all/:id",
  BloodGroupModel.blood_group_single
);
app.post(
  "/Admin/blood_group/blood_group_delete/:id",
  BloodGroupModel.blood_group_delete
);
app.get(
  "/Admin/blood_group/blood_group_list_paigination/:pageNo/:perPage",
  BloodGroupModel.blood_group_list_paigination
);


const CompanyTypeModel = require("../app/model/Admin/company_type_model/company_type_model.js");
app.post(
  "/Admin/company_type/company_type_create",
  CompanyTypeModel.company_type_create
);
app.get(
  "/Admin/company_type/company_type_all",
  CompanyTypeModel.company_type_list
);
app.get(
  "/Admin/company_type/company_type_all/:id",
  CompanyTypeModel.company_type_single
);
app.post(
  "/Admin/company_type/company_type_edit/:id",
  CompanyTypeModel.company_type_update
);
app.post(
  "/Admin/company_type/company_type_delete/:id",
  CompanyTypeModel.company_type_delete
);

// list Pagination
app.get(
  "/Admin/company_type/company_type_list_paigination/:pageNo/:perPage",
  CompanyTypeModel.company_type_list_paigination
);


// Designation
const DesignationModel = require("../app/model/Admin/designation_model/designation_model.js");

app.post(
  "/Admin/designation/designation_create",
  DesignationModel.designation_create
);
app.get(
  "/Admin/designation/designation_all",
  DesignationModel.designation_list
);
app.post(
  "/Admin/designation/designation_delete/:id",
  DesignationModel.designation_delete
);
app.post(
  "/Admin/designation/designation_edit/:id",
  DesignationModel.designation_update
);
app.get(
  "/Admin/designation/designation_all/:id",
  DesignationModel.designation_single
);

// list Pagination
app.get(
  "/Admin/designation/designation_list_paigination/:pageNo/:perPage",
  DesignationModel.designation_list_paigination
);

// Profession
const ProfessionModel = require("../app/model/Admin/profession_model/profession_model.js");

app.post(
  "/Admin/profession/profession_create",
  ProfessionModel.profession_create
);
app.get("/Admin/profession/profession_all", ProfessionModel.profession_list);
app.post(
  "/Admin/profession/profession_delete/:id",
  ProfessionModel.profession_delete
);
app.post(
  "/Admin/profession/profession_edit/:id",
  ProfessionModel.profession_update
);
app.get(
  "/Admin/profession/profession_all/:id",
  ProfessionModel.profession_single
);

// list Pagination
app.get(
  "/Admin/profession/profession_list_paigination/:pageNo/:perPage",
  ProfessionModel.profession_list_paigination
);


const EducationModel = require("../app/model/Admin/education_model/education_model.js");
app.post("/Admin/education/education_create", EducationModel.education_create);
app.get("/Admin/education/education_all", EducationModel.education_list);
app.post(
  "/Admin/education/education_edit/:id",
  EducationModel.education_update
);
app.get("/Admin/education/education_all/:id", EducationModel.education_single);
app.post(
  "/Admin/education/education_delete/:id",
  EducationModel.education_delete
);
// list Pagination
app.get(
  "/Admin/education/education_list_paigination/:pageNo/:perPage",
  EducationModel.education_list_paigination
);


const ReligionModel = require("../app/model/Admin/religion_model/religion_model.js");
app.post("/Admin/religion/religion_create", ReligionModel.religion_create);
app.get("/Admin/religion/religion_all", ReligionModel.religion_list);
app.post("/Admin/religion/religion_edit/:id", ReligionModel.religion_update);
app.get("/Admin/religion/religion_all/:id", ReligionModel.religion_single);
app.post("/Admin/religion/religion_delete/:id", ReligionModel.religion_delete);
app.get("/Admin/religion/religion_list_paigination/:pageNo/:perPage", ReligionModel.religion_list_paigination);




// PhotoGalleryCategoryModel
const PhotoGalleryCategoryModel = require("../app/model/Admin/events_category_model/events_category.js");

app.post(
  "/Admin/events_category/events_category_create",
  PhotoGalleryCategoryModel.photo_gallery_category_create
);
app.get(
  "/Admin/events_category/events_category_all",
  PhotoGalleryCategoryModel.photo_gallery_category_list
);
app.post(
  "/Admin/events_category/events_category_edit/:id",
  PhotoGalleryCategoryModel.photo_gallery_category_update
);
app.get(
  "/Admin/events_category/events_category_all/:id",
  PhotoGalleryCategoryModel.photo_gallery_category_single
);
app.post(
  "/Admin/events_category/events_category_delete/:id",
  PhotoGalleryCategoryModel.photo_gallery_category_delete
);

// list Pagination
app.get(
  "/Admin/events_category/events_category_list_paigination/:pageNo/:perPage",
  PhotoGalleryCategoryModel.photo_gallery_category_list_paigination
);
// NewsCategoryModel
const NewsCategoryModel = require("../app/model/Admin/news_category_model/news_category.js");

app.post(
  "/Admin/news_category/news_category_create",
  NewsCategoryModel.news_category_create
);
app.get(
  "/Admin/news_category/news_category_all",
  NewsCategoryModel.news_category_list
);
app.post(
  "/Admin/news_category/news_category_edit/:id",
  NewsCategoryModel.news_category_update
);
app.get(
  "/Admin/news_category/news_category_all/:id",
  NewsCategoryModel.news_category_single
);
app.post(
  "/Admin/news_category/news_category_delete/:id",
  NewsCategoryModel.news_category_delete
);

// list Pagination
app.get(
  "/Admin/news_category/news_category_list_paigination/:pageNo/:perPage",
  NewsCategoryModel.news_category_list_paigination
);
// NoticeCategoryModel

const NoticeCategoryModel = require("../app/model/Admin/notice_category_model/notice_category.js");

app.post(
  "/Admin/notice_category/notice_category_create",
  NoticeCategoryModel.notice_category_create
);
app.get(
  "/Admin/notice_category/notice_category_all",
  NoticeCategoryModel.notice_category_list
);
app.post(
  "/Admin/notice_category/notice_category_edit/:id",
  NoticeCategoryModel.notice_category_update
);
app.get(
  "/Admin/notice_category/notice_category_all/:id",
  NoticeCategoryModel.notice_category_single
);
app.post(
  "/Admin/notice_category/notice_category_delete/:id",
  NoticeCategoryModel.notice_category_delete
);

// list Pagination
app.get(
  "/Admin/notice_category/notice_category_list_paigination/:pageNo/:perPage",
  NoticeCategoryModel.notice_category_list_paigination
);
// VideoGalleryCategoryModel

const VideoGalleryCategoryModel = require("../app/model/Admin/video_category_model/video_category.js");

app.post(
  "/Admin/video_gallery_category/video_gallery_category_create",
  VideoGalleryCategoryModel.video_gallery_category_create
);
app.get(
  "/Admin/video_gallery_category/video_gallery_category_all",
  VideoGalleryCategoryModel.video_gallery_category_list
);
app.post(
  "/Admin/video_gallery_category/video_gallery_category_edit/:id",
  VideoGalleryCategoryModel.video_gallery_category_update
);
app.get(
  "/Admin/video_gallery_category/video_gallery_category_all/:id",
  VideoGalleryCategoryModel.video_gallery_category_single
);
app.post(
  "/Admin/video_gallery_category/video_gallery_category_delete/:id",
  VideoGalleryCategoryModel.video_gallery_category_delete
);

// list Pagination
app.get(
  "/Admin/video_gallery_category/video_category_list_paigination/:pageNo/:perPage",
  VideoGalleryCategoryModel.video_gallery_category_list_paigination
);


// newsmodel
const NewsModel = require("../app/model/Admin/news_model/news_model.js");

app.post("/Admin/news/news_create", NewsModel.news_create);
app.get("/Admin/news/news_all", NewsModel.news_list);
app.post("/Admin/news/news_delete/:id", NewsModel.news_delete);
app.post("/Admin/news/news_edit/:id", NewsModel.news_update);
app.get("/Admin/news/news_all/:id", NewsModel.news_single);
app.post("/Admin/news/news_search", NewsModel.news_list_search);
app.post("/Admin/news/news_pdf", NewsModel.news_list_pdf);
app.post("/Admin/news/news_print", NewsModel.news_list_print);
// list pagenation
app.get(
  "/Admin/news/news_list_paigination/:pageNo/:perPage",
  NewsModel.news_list_paigination
);
// NoticeModel

const NoticeModel = require("../app/model/Admin/notice_model/notice_model.js");

app.post("/Admin/notice/notice_create", NoticeModel.notice_create);
app.get("/Admin/notice/notice_all", NoticeModel.notice_list);
app.post("/Admin/notice/notice_delete/:id", NoticeModel.notice_delete);
app.post("/Admin/notice/notice_edit/:id", NoticeModel.notice_update);
app.get("/Admin/notice/notice_all/:id", NoticeModel.notice_single);
app.post("/Admin/notice/notice_search", NoticeModel.notice_list_search);
app.post("/Admin/notice/notice_print", NoticeModel.notice_list_print);
app.post("/Admin/notice/notice_pdf", NoticeModel.notice_list_pdf);

// list Pagination
app.get(
  "/Admin/notice/notice_list_paigination/:pageNo/:perPage",
  NoticeModel.notice_list_paigination
);


// VideoGalleryModel

const VideoGalleryModel = require("../app/model/Admin/video_gallery_model/video_gallery.js");

app.post(
  "/Admin/video_gallery/video_gallery_create",
  VideoGalleryModel.video_gallery_create
);
app.get(
  "/Admin/video_gallery/video_gallery_all",
  VideoGalleryModel.video_gallery_list
);
app.post(
  "/Admin/video_gallery/video_gallery_delete/:id",
  VideoGalleryModel.video_gallery_delete
);
app.post(
  "/Admin/video_gallery/video_gallery_edit/:id",
  VideoGalleryModel.video_gallery_update
);
app.get(
  "/Admin/video_gallery/video_gallery_all/:id",
  VideoGalleryModel.video_gallery_single
);

app.get(
  "/Admin/video_gallery/video_gallery_list_paigination/:pageNo/:perPage",
  VideoGalleryModel.video_gallery_list_paigination
);



const AttendanceModel = require('../app/model/Admin/attendance_model/attendance_model')
app.post("/Admin/attendance/attendance_search", AttendanceModel.attendance_search
);
app.post("/Admin/attendance/attendance_create", AttendanceModel.attendance_create
);
app.post("/Admin/absent/absent_create", AttendanceModel.absent_create
);

app.post("/Admin/attendance/attendance_otp", AttendanceModel.send_attendance_otp
);
app.get("/Admin/attendance/attendance_all", AttendanceModel.attendance_list
);
app.get("/Admin/attendance/attendance_all_list", AttendanceModel.attendance_list_all_data
);
app.get("/Admin/absent/absent_all", AttendanceModel.absent_list);

app.post("/Admin/attendance/attendance_list_search", AttendanceModel.attendance_list_search
);
app.post("/Admin/attendance/attendance_list_pdf", AttendanceModel.attendance_list_pdf
);
app.post("/Admin/attendance/attendance_list_print", AttendanceModel.attendance_list_print
);
app.post("/Admin/attendance/attendance_log_search", AttendanceModel.attendance_log_search
);
app.post("/Admin/attendance/attendance_log_prtint", AttendanceModel.attendance_log_print
);
app.post("/Admin/attendance/attendance_log_pdf", AttendanceModel.attendance_log_pdf
);
app.post("/Admin/attendance/attendance_summary_search", AttendanceModel.attendance_summary_search
);
app.post("/Admin/attendance/attendance_summary_print", AttendanceModel.attendance_summary_print
);
app.post("/Admin/attendance/attendance_summary_pdf", AttendanceModel.attendance_summary_pdf
);
app.get("/Admin/attendance/attendance_details_list", AttendanceModel.attendance_details_list
);
app.post("/Admin/absent/absent_list_search", AttendanceModel.absent_list_search
);
app.post("/Admin/absent/absent_delete/:id", AttendanceModel.absent_delete
);
app.post("/Admin/attendance/attendance_delete/:id", AttendanceModel.attendance_delete
);
app.post("/Admin/attendance/attendance_details_print", AttendanceModel.attendance_details_print
);
app.post("/Admin/attendance/attendance_details_pdf", AttendanceModel.attendance_details_pdf
);
app.get("/Admin/attendance_sms/attendance_sms_campaign_category", AttendanceModel.sms_campaign_category_list
);

app.get("/Admin/absent_sms/absent_create_manual_attendance", AttendanceModel.absent_create_manual_attendance
);


const AccountReportModel = require('../app/model/Admin/account_report_model/account_report_model')

app.post("/Admin/account_report/account_report_expense", AccountReportModel.expense_search_account_report
);
app.post("/Admin/account_report/expense_search_account_reports", AccountReportModel.expense_search_account_reports
);
app.post("/Admin/account_report/account_report_income", AccountReportModel.income_search_account_report
);
app.post("/Admin/account_report/account_report_salary", AccountReportModel.salary_search_account_report
);
app.post("/Admin/account_report/general_ledgers_print", AccountReportModel.general_ledgers_print
);
app.post("/Admin/account_report/general_ledgers_pdf", AccountReportModel.general_ledgers_pdf
);
app.post("/Admin/account_report/balance_sheet_print", AccountReportModel.balance_sheet_print
);
app.post("/Admin/account_report/balance_sheet_pdf", AccountReportModel.balance_sheet_pdf
);
app.post("/Admin/account_report/income_amount_account_report", AccountReportModel.income_amount_account_report
);
app.post("/Admin/account_report/expense_amount_account_report", AccountReportModel.expense_amount_account_report
);
app.post("/Admin/account_report/accounts_report_print", AccountReportModel.accounts_report_print
);
app.post("/Admin/account_report/accounts_report_pdf", AccountReportModel.accounts_report_pdf
);
app.post("/Admin/account_report/trail_balance_print", AccountReportModel.trail_balance_print
);
app.post("/Admin/account_report/trail_balance_pdf", AccountReportModel.trail_balance_pdf
);


const AssetTypeModel = require('../app/model/Admin/asset_type_model/asset_type_model')
app.post("/Admin/asset_type/asset_type_create", AssetTypeModel.asset_type_create
);
app.post("/Admin/asset_type/asset_type_edit/:id", AssetTypeModel.asset_type_update
);
app.get("/Admin/asset_type/asset_type_all", AssetTypeModel.asset_type_list
);
app.get("/Admin/asset_type/asset_type_all/:id", AssetTypeModel.asset_type_single
);
app.post("/Admin/asset_type/asset_type_delete/:id", AssetTypeModel.asset_type_delete
);
app.post("/Admin/asset_type/asset_type_search", AssetTypeModel.asset_type_search
);
app.post("/Admin/asset_type/asset_type_pdf", AssetTypeModel.asset_type_pdf
);
app.post("/Admin/asset_type/asset_type_print", AssetTypeModel.asset_type_print
);
app.get("/Admin/asset_type/asset_type_list_paigination/:pageNo/:perPage", AssetTypeModel.asset_type_list_paigination
);

const AssetInfoModel = require('../app/model/Admin/asset_info_model/asset_info_model')
app.post("/Admin/asset_info/asset_info_create", AssetInfoModel.asset_info_create
);
app.get("/Admin/asset_info/asset_info_all", AssetInfoModel.asset_info_list
);
app.get("/Admin/asset_info/asset_info_all/:id", AssetInfoModel.asset_info_single
);
app.post("/Admin/asset_info/asset_info_delete/:id", AssetInfoModel.asset_info_delete
);
app.post("/Admin/asset_info/asset_info_edit/:id", AssetInfoModel.asset_info_update
);
app.post("/Admin/asset_info/asset_info_search", AssetInfoModel.asset_info_search
);
app.post("/Admin/asset_info/asset_info_pdf", AssetInfoModel.asset_info_pdf
);
app.post("/Admin/asset_info/asset_info_print", AssetInfoModel.asset_info_print
);
app.get("/Admin/asset_info/asset_info_list_paigination/:pageNo/:perPage", AssetInfoModel.asset_info_list_paigination
);

const employeeAssetModel = require('../app/model/Admin/employee_asset_model/employee_asset_model')
app.post("/Admin/asset_employee/asset_employee_create", employeeAssetModel.asset_employee_create
);
app.get("/Admin/asset_employee/asset_employee_all", employeeAssetModel.asset_employee_list
);
app.get("/Admin/asset_employee/asset_employee_all/:id", employeeAssetModel.asset_employee_single
);
app.post("/Admin/asset_employee/asset_employee_edit/:id", employeeAssetModel.asset_employee_update
);
app.post("/Admin/asset_employee/asset_employee_delete/:id", employeeAssetModel.asset_employee_delete
);
app.post("/Admin/asset_employee/asset_employee_search", employeeAssetModel.asset_employee_search
);
app.post("/Admin/asset_employee/asset_employee_pdf", employeeAssetModel.asset_employee_pdf
);
app.post("/Admin/asset_employee/asset_employee_print", employeeAssetModel.asset_employee_print
);
app.get("/Admin/asset_employee/asset_employee_all_paigination/:pageNo/:perPage", employeeAssetModel.asset_employee_list_paigination
);

const LoanOthorityModel = require('../app/model/Admin/loan_othority_model/loan_othority_model')
app.post("/Admin/loan_authority/loan_authority_create", LoanOthorityModel.loan_authority_create
);
app.get("/Admin/loan_authority/loan_authority_all", LoanOthorityModel.loan_authority_list
);
app.get("/Admin/loan_authority/loan_authority_all/:id", LoanOthorityModel.loan_authority_single
);
app.post("/Admin/loan_authority/loan_authority_edit/:id", LoanOthorityModel.loan_authority_update
);
app.post("/Admin/loan_authority/loan_authority_delete/:id", LoanOthorityModel.loan_authority_delete
);
app.post("/Admin/loan_authority/loan_authority_search", LoanOthorityModel.loan_authority_search
);
app.post("/Admin/loan_authority/loan_authority_pdf", LoanOthorityModel.loan_authority_pdf
);
app.post("/Admin/loan_authority/loan_authority_print", LoanOthorityModel.loan_authority_print
);
app.get("/Admin/loan_authority/loan_authority_all_paigination/:pageNo/:perPage", LoanOthorityModel.loan_authority_list_paigination
);


const LoanModel = require('../app/model/Admin/laon_model/loan_model')
app.post("/Admin/loan/loan_create", LoanModel.loan_create
);
app.get("/Admin/loan/loan_all", LoanModel.loan_list
);
app.get("/Admin/loan/loan_all/:id", LoanModel.loan_single
);
app.post("/Admin/loan/loan_delete/:id", LoanModel.loan_delete
);
app.post("/Admin/loan/loan_edit/:id", LoanModel.loan_update
);
app.post("/Admin/loan/loan_search", LoanModel.loan_search
);
app.post("/Admin/loan/loan_pdf", LoanModel.loan_pdf
);
app.post("/Admin/loan/loan_print", LoanModel.loan_print
);
app.get("/Admin/loan/loan_all_paigination/:pageNo/:perPage", LoanModel.loan_list_paigination
);


const SalesModel = require('../app/model/Admin/sales_model/sales_model')
app.post("/Admin/sales/sales_search", SalesModel.sales_search
);
app.post("/Admin/sales/sale_create", SalesModel.sale_create
);
app.post("/Admin/sales/sale_edit/:id", SalesModel.sale_edit
);
app.post("/Admin/sales/sale_list_search", SalesModel.sale_list_search
);
app.post("/Admin/sales/sale_list_print", SalesModel.sale_list_print
);
app.post("/Admin/sales/sale_invoice_print_single", SalesModel.sale_invoice_print_single
);
app.post("/Admin/sales/sale_invoice_pdf_download_single", SalesModel.sale_invoice_pdf_download_single
);
app.post("/Admin/sales/sale_list_print_single", SalesModel.sale_list_print_single
);
app.post("/Admin/sales/sale_list_print_all", SalesModel.sale_list_print_all
);
app.post("/Admin/sales/sale_list_pdf_single", SalesModel.sale_list_pdf_single
);
app.post("/Admin/sales/sale_list_pdf", SalesModel.sale_list_pdf
);
app.post("/Admin/sales/sale_print_all_invoice", SalesModel.sale_print_all_invoice
);
app.get("/Admin/sales/sales_list", SalesModel.sales_list
);
app.get("/Admin/sales/sale_product_list", SalesModel.sale_product_list
);
app.get("/Admin/sales/sales_list/:id", SalesModel.sale_single
);


app.post("/Admin/sales/saler_due_pdf", SalesModel.saler_due_pdf
);
app.post("/Admin/sales/saler_due_print", SalesModel.saler_due_print
);


app.get("/Admin/loan/sale_list_paigination/:pageNo/:perPage", SalesModel.sale_list_paigination
);
app.post("/Admin/loan/sales_delete/:id", SalesModel.sales_delete
);
app.get("/Admin/loan/users_due_amount_sale/:user_id", SalesModel.users_due_amount_sale
);
app.post("/Admin/loan/sale_product_delete/:id", SalesModel.sale_product_delete
);
app.get("/Admin/loan/users_due_amount_all_sale", SalesModel.users_due_amount_all_sale
);
app.get("/Admin/loan/users_due_amount_all_sales", SalesModel.users_due_amount_all_sales
);
app.post("/Admin/sale/users_due_amount_all_sale_search", SalesModel.users_due_amount_all_sale_search
);
app.get("/Admin/purchase_product/purchase_product_list", SalesModel.purchase_product_list
);
app.get("/Admin/purchase_product/purchase_product_list_ware_house", SalesModel.purchase_product_list_ware_house
);
app.post("/Admin/loan/sale_due_list_pdf_single", SalesModel.sale_due_list_pdf_single
);
app.post("/Admin/loan/sale_due_list_print_single", SalesModel.sale_due_list_print_single
);



const FontServiceBoxModel = require('../app/model/Admin/front_service_box_model/front_service_box_model')

app.get("/Admin/page_list/page_list_list", FontServiceBoxModel.page_list_list
);
app.get("/Admin/page_list/page_list_list_one", FontServiceBoxModel.page_list_list_one
);
app.get("/Admin/front_service_box/front_service_box_list", FontServiceBoxModel.front_service_box_list
);
app.post('/Admin/page_list/all_table_data', FontServiceBoxModel.all_table_data)
app.post('/Admin/front_service_box/front_service_box_create', FontServiceBoxModel.front_service_box_create)

app.post('/Admin/front_service_box/front_service_box_update/:id', FontServiceBoxModel.front_service_box_update)

app.post('/Admin/front_service_box/front_service_box_delete/:id', FontServiceBoxModel.front_service_box_delete)

app.post('/Admin/front_service_box/front_service_box_search', FontServiceBoxModel.front_service_box_search)

app.get('/Admin/front_service_box/front_service_box_list_paigination/:pageNo/:perPage', FontServiceBoxModel.front_service_box_list_paigination)

app.get('/Admin/front_service_box/front_service_box_single/:id', FontServiceBoxModel.front_service_box_single)

app.post('/Admin/front_service_box/front_service_box_list_pdf', FontServiceBoxModel.front_service_box_list_pdf)

app.post('/Admin/front_service_box/front_service_box_list_print', FontServiceBoxModel.front_service_box_list_print)

// const PurchaseModelProduct = require('../app/model/Admin/purchase_product_model/purchase_product_model')
// app.post("/Admin/purchase_product/purchase_product_create", PurchaseModelProduct.purchase_product_create
// );
// app.get("/Admin/purchase_product/purchase_product_all", PurchaseModelProduct.purchase_product_list
// );
// app.get("/Admin/purchase_product/purchase_product_all/:id", PurchaseModelProduct.purchase_product_single
// );
// app.post("/Admin/purchase_product/purchase_product_delete/:id", PurchaseModelProduct.purchase_product_delete
// );
// app.post("/Admin/purchase_product/purchase_product_edit/:id", PurchaseModelProduct.purchase_product_update
// );
// app.post("/Admin/purchase_product/purchase_product_search", PurchaseModelProduct.purchase_product_search
// );
// app.post("/Admin/purchase_product/purchase_product_pdf", PurchaseModelProduct.purchase_product_pdf
// );
// app.post("/Admin/purchase_product/purchase_product_print", PurchaseModelProduct.purchase_product_print
// );
// app.get("/Admin/purchase_product/purchase_product_all_paigination/:pageNo/:perPage", PurchaseModelProduct.purchase_product_list_paigination
// );



const PopUpModel = require('../app/model/Admin/pop_up_model/pop_up_model')
app.get("/Admin/pop_up/pop_up_size_list", PopUpModel.pop_up_size_list
);
app.get("/Admin/pop_up/pop_up_animation_list", PopUpModel.pop_up_animation_list
);
app.post("/Admin/pop_up/pop_up_create", PopUpModel.pop_up_create
);
app.post("/Admin/pop_up/pop_up_update/:id", PopUpModel.pop_up_update
);
app.get("/Admin/pop_up/pop_up_list", PopUpModel.pop_up_list
);
app.get("/Admin/pop_up/pop_up_list/:id", PopUpModel.pop_up_single
);
app.post("/Admin/pop_up/pop_up_delete/:id", PopUpModel.pop_up_delete
);
app.post("/Admin/pop_up/pop_up_search", PopUpModel.pop_up_search
);
app.post("/Admin/pop_up/pop_up_list_pdf", PopUpModel.pop_up_list_pdf
);
app.post("/Admin/pop_up/pop_up_list_print", PopUpModel.pop_up_list_print
);
app.get('/Admin/front_service_box/pop_up_list_paigination/:pageNo/:perPage', PopUpModel.pop_up_list_paigination)


const CustomPageModel = require('../app/model/Admin/custom_page_model/custom_page_model')
app.post("/Admin/custom_page/custom_page_create", CustomPageModel.custom_page_create
);
app.post("/Admin/custom_page/custom_page_update/:id", CustomPageModel.custom_page_update
);
app.get("/Admin/custom_page/custom_page_list", CustomPageModel.custom_page_list
);
app.get("/Admin/custom_page/custom_page_list_all", CustomPageModel.custom_page_list_all
);
app.get("/Admin/custom_page/custom_page_list_all/:id", CustomPageModel.custom_page_list_single
);
app.get("/Admin/custom_page/custom_page_list_paigination/:pageNo/:perPage", CustomPageModel.custom_page_list_paigination
);
app.post("/Admin/custom_page/custom_page_search", CustomPageModel.custom_page_search
);
app.post("/Admin/custom_page/custome_page_list_pdf", CustomPageModel.custome_page_list_pdf
);
app.post("/Admin/custom_page/custom_page_list_print", CustomPageModel.custom_page_list_print
);
app.post("/Admin/custom_page/custom_page_delete/:id", CustomPageModel.custom_page_delete
);



const SliderModel = require('../app/model/Admin/slider_model/slider_model')
app.get("/Admin/slider/transition_list", SliderModel.transition_list
);
app.post("/Admin/slider/slider_create", SliderModel.slider_create
);
app.post("/Admin/slider/slider_update/:id", SliderModel.slider_update
);
app.post("/Admin/slider/slider_search", SliderModel.slider_search
);
app.post("/Admin/slider/slider_delete/:id", SliderModel.slider_delete
);
app.post("/Admin/slider/slider_img_link_delete/:id", SliderModel.slider_img_link_delete
);
app.get("/Admin/slider/slider_list", SliderModel.slider_list
);
app.get("/Admin/slider/slider_list_all", SliderModel.slider_list_all
);
app.get("/Admin/slider/sales_list_single/:id", SliderModel.sales_list_single
);
app.get("/Admin/slider/slider_list_paigination/:pageNo/:perPage", SliderModel.slider_list_paigination
);
 

const PurchaseModel = require('../app/model/Admin/purchase_model/purchase_model')
app.post("/Admin/purchase_product/purchase_product_creates", PurchaseModel.non_stock_purchase_create
);
app.post("/Admin/purchase_create/purchase_creates", PurchaseModel.purchase_create
);
app.post("/Admin/non_stock_purchase/create_non_stock_purchase", PurchaseModel.non_stock_purchase_create
);
app.get("/Admin/purchase/purchase_list", PurchaseModel.purchase_list
);
app.post("/Admin/purchase/purchase_search", PurchaseModel.purchase_search
);
app.post("/Admin/purchase/purchase_delete/:id", PurchaseModel.purchase_delete
);
app.get("/Admin/purchase/purchase_list/:id", PurchaseModel.purchase_single
);
app.post("/Admin/purchase/purchase_edit/:id", PurchaseModel.purchase_update
);
app.post("/Admin/purchase/purchase_pdf", PurchaseModel.purchase_pdf
);
app.post("/Admin/stock/stock_pdf", PurchaseModel.stock_pdf
);
app.post("/Admin/stock/stock_print", PurchaseModel.stock_print
);
app.post("/Admin/stock/stock_product_price_pdf", PurchaseModel.stock_product_price_pdf
);
app.post("/Admin/stock/stock_product_price_print", PurchaseModel.stock_product_price_print
);

app.post("/Admin/stock/stock_details_pdf", PurchaseModel.stock_details_pdf
);

app.post("/Admin/supplier_due/supplier_due_pdf", PurchaseModel.supplier_due_pdf
);
app.post("/Admin/supplier_due/supplier_due_print", PurchaseModel.supplier_due_print
);
app.post("/Admin/stock/stock_details_print", PurchaseModel.stock_details_print
);
app.post("/Admin/purchase/purchase_print", PurchaseModel.purchase_print
);
app.post("/Admin/purchase/supplier_due_amount_purchase_list_search", PurchaseModel.supplier_due_amount_purchase_list_search
);
app.get("/Admin/purchase/purchase_type_list", PurchaseModel.purchase_type_list
);
app.get("/Admin/purchase/purchase_supplier_due/:supplier_id", PurchaseModel.supplier_due_amount_purchase
);
app.get("/Admin/purchase/supplier_due_amount_purchase_list", PurchaseModel.supplier_due_amount_purchase_list
);

app.get("/Admin/purchase/purchase_all_paigination/:pageNo/:perPage", PurchaseModel.purchase_list_paigination
);
app.get("/Admin/purchase/purchase_product_stock_list", PurchaseModel.purchase_product_stock_list
);
app.get("/Admin/purchase/purchase_product_stock_list_current_month", PurchaseModel.purchase_product_stock_list_current_month
);
app.post("/Admin/purchase/purchase_product_stock_list_search", PurchaseModel.purchase_product_stock_list_search
);
app.post("/Admin/report/stock_category_sub_category_print", PurchaseModel.stock_category_sub_category_print
);
app.post("/Admin/report/stock_category_sub_category_pdf", PurchaseModel.stock_category_sub_category_pdf
);
app.get("/Admin/report/purchase_product_stock_list_current_month_ware_house", PurchaseModel.purchase_product_stock_list_current_month_ware_house
);
app.post("/Admin/report/purchase_product_stock_list_current_month_ware_house_search", PurchaseModel.purchase_product_stock_list_current_month_ware_house_search
);
app.post("/Admin/report/stock_category_sub_category_print_ware_house", PurchaseModel.stock_category_sub_category_print_ware_house
);
app.post("/Admin/report/stock_category_sub_category_pdf_ware_house", PurchaseModel.stock_category_sub_category_pdf_ware_house
);
app.get("/Admin/report/purchase_supplier_due_list", PurchaseModel.purchase_supplier_due_list
);

app.post("/Admin/report/purchase_due_list_pdf_single", PurchaseModel.purchase_due_list_pdf_single
);
app.post("/Admin/report/purchase_due_list_print_single", PurchaseModel.purchase_due_list_print_single
);



const WareHouseModel = require('../app/model/Admin/ware_house_model/ware_house_model')
app.post("/Admin/ware_house/ware_house_create", WareHouseModel.ware_house_create
);
app.get("/Admin/ware_house/ware_house_all", WareHouseModel.ware_house_list
);
app.get("/Admin/ware_house/ware_house_all/:id", WareHouseModel.ware_house_single
);
app.post("/Admin/ware_house/ware_house_delete/:id", WareHouseModel.ware_house_delete
);
app.post("/Admin/ware_house/ware_house_edit/:id", WareHouseModel.ware_house_update
);
app.post("/Admin/ware_house/ware_house_search", WareHouseModel.ware_house_search
);

app.get("/Admin/ware_house/ware_house_all_paigination/:pageNo/:perPage", WareHouseModel.ware_house_list_paigination
);

const LoanPaymentModel = require('../app/model/Admin/loan_payment_model/loan_payment_model')
app.post("/Admin/loan_payment/loan_payment_create", LoanPaymentModel.loan_payment_create
);

app.get("/Admin/loan_payment/loan_payment_all", LoanPaymentModel.loan_payment_list
);
app.get("/Admin/loan_payment/loan_payment_all/:id", LoanPaymentModel.loan_payment_single
);
app.post("/Admin/loan_payment/loan_payment_update/:id", LoanPaymentModel.loan_payment_update
);
app.post("/Admin/loan_payment/loan_payment_delete/:id", LoanPaymentModel.loan_payment_delete
);
app.post("/Admin/loan_payment/loan_payment_search", LoanPaymentModel.loan_payment_search
);
app.post("/Admin/loan_payment/loan_payment_pdf", LoanPaymentModel.loan_payment_pdf
);
app.post("/Admin/loan_payment/loan_payment_print", LoanPaymentModel.loan_payment_print
);
app.get("/Admin/loan_payment/loan_payment_type_list", LoanPaymentModel.loan_payment_type_list
);
app.get("/Admin/loan_payment/loan_payment_list_paigination/:pageNo/:perPage", LoanPaymentModel.loan_payment_list_paigination
);

const EmployeeLoan = require('../app/model/Admin/employe_loan_model/employe_loan_model')
app.post("/Admin/employe_loan/employe_loan_create", EmployeeLoan.employe_loan_create
);
app.get("/Admin/employe_loan/employe_loan_all", EmployeeLoan.employe_loan_list
);
app.get("/Admin/employe_loan/employe_loan_all/:id", EmployeeLoan.employe_loan_single
);
app.post("/Admin/employe_loan/employe_loan_update/:id", EmployeeLoan.employe_loan_update
);
app.post("/Admin/employe_loan/employe_loan_delete/:id", EmployeeLoan.employe_loan_delete
);
app.get("/Admin/employe_loan/employe_loan_list_paigination/:pageNo/:perPage", EmployeeLoan.employe_loan_list_paigination
);
app.post("/Admin/employe_loan/employe_loan_search", EmployeeLoan.employe_loan_search
);
app.post("/Admin/employe_loan/employe_loan_pdf", EmployeeLoan.employe_loan_pdf
);
app.post("/Admin/employe_loan/employe_loan_print", EmployeeLoan.employe_loan_print
);


const LoanPaymentModelEmployee = require('../app/model/Admin/employe_loan_payment_model/employe_loan_payment_model')
app.post("/Admin/employe_loan_payment/employe_loan_payment_create", LoanPaymentModelEmployee.employe_loan_payment_create
);

app.get("/Admin/employe_loan_payment/employe_loan_payment_all", LoanPaymentModelEmployee.employe_loan_payment_list
);
app.get("/Admin/employe_loan_payment/employe_loan_payment_all/:id", LoanPaymentModelEmployee.employe_loan_payment_single
);
app.post("/Admin/employe_loan_payment/employe_loan_payment_update/:id", LoanPaymentModelEmployee.employe_loan_payment_update
);
app.post("/Admin/employe_loan_payment/employe_loan_payment_delete/:id", LoanPaymentModelEmployee.employe_loan_payment_delete
);
app.post("/Admin/employe_loan_payment/employe_loan_payment_search", LoanPaymentModelEmployee.employe_loan_payment_search
);
app.post("/Admin/employe_loan_payment/employe_loan_payment_pdf", LoanPaymentModelEmployee.employe_loan_payment_pdf
);
app.post("/Admin/employe_loan_payment/employe_loan_payment_print", LoanPaymentModelEmployee.employe_loan_payment_print
);
app.get("/Admin/employe_loan_payment/employe_loan_payment_type_list", LoanPaymentModelEmployee.employe_loan_payment_type_list
);
app.get("/Admin/employe_loan_payment/employe_loan_payment_list_paigination/:pageNo/:perPage", LoanPaymentModelEmployee.employe_loan_payment_list_paigination
);

app.get('/account_report_combined', async (req, res) => {
  const today = new Date();
  const fromDate = req.query.fromDate || new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const toDate = req.query.toDate || new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  try {
    // Make the request for expense search
    const expenseResponse = await axios.post(`http://192.168.0.109:5002/Admin/account_report/expense_search_account_reports`, {
      fromDate,
      toDate
    });

    // Make the request for income search
    const incomeResponse = await axios.post(`http://192.168.0.109:5002/Admin/account_report/account_report_income`, {
      fromDate,
      toDate
    });

    // Fetch account head data
    const accountHeadResponse = await axios.get(`http://192.168.0.109:5002/Admin/account_head/account_head_list`);

    // Combine results from both searches
    const combinedExpenseResults = expenseResponse.data.results || [];
    const combinedIncomeResults = incomeResponse.data.results || [];
    const accountHeadList = accountHeadResponse.data || [];

    if (combinedExpenseResults.length === 0 && combinedIncomeResults.length === 0) {
      return res.status(200).json({ message: 'Nothing found!', results: [] });
    }

    // Group by 'paid_by' for expense results
    const expenseByPaidBy = combinedExpenseResults.reduce((acc, result) => {
      if (!acc[result.paid_by]) {
        acc[result.paid_by] = 0;
      }
      acc[result.paid_by] += result.sub_total;
      return acc;
    }, {});

    // Group by 'paid_by' for income results
    const incomeByPaidBy = combinedIncomeResults.reduce((acc, result) => {
      if (!acc[result.paid_by]) {
        acc[result.paid_by] = 0;
      }
      acc[result.paid_by] += result.sub_total;
      return acc;
    }, {});

    // Calculate the total sub_totals for both expense and income
    const subTotalExpense = Object.values(expenseByPaidBy).reduce((sum, value) => sum + value, 0);
    const subTotalIncome = Object.values(incomeByPaidBy).reduce((sum, value) => sum + value, 0);

    let totalAmountSum = 0;

    // Map over account head list and calculate total amounts
    const accountRows = accountHeadList.map((account) => {
      const expenseAmount = expenseByPaidBy[account.id] || 0;
      const incomeAmount = incomeByPaidBy[account.id] || 0;
      // const totalAmount = expenseAmount + incomeAmount;
      const totalAmount = incomeAmount - expenseAmount;

      totalAmountSum += totalAmount;

      return {
        account_head_name: account.account_head_name,
        totalAmount: totalAmount.toLocaleString(),
      };
    });

    // Send the final response
    res.status(200).json({
      totalAmountSum,
      accountRows,
      subTotalExpense,
      subTotalIncome,
    });

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
});

app.get('/api/account_report', async (req, res) => {
  // const { fromDate, toDate } = req.query; // Get parameters from query
  const today = new Date();
  const fromDate = req.query.fromDate || new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const toDate = req.query.toDate || new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  try {
    // Make the first request for expense search
    const expenseResponse = await axios.post(`http://192.168.0.109:5002/Admin/account_report/expense_search_account_reports`, {
      fromDate, toDate
    });

    // Make the second request for income search
    const incomeResponse = await axios.post(`http://192.168.0.109:5002/Admin/account_report/account_report_income`, {
      fromDate, toDate
    });

    // Combine results from both searches
    const combinedResults = expenseResponse.data.results;
    const combinedResultsIncome = incomeResponse.data.results;

    if (combinedResults.length === 0 && combinedResultsIncome.length === 0) {
      return res.status(404).json({ message: 'Nothing found!' });
    } else {
      const sub_total = combinedResults.reduce((sum, result) => sum + result.sub_total, 0);
      const sub_totalIncome = combinedResultsIncome.reduce((sum, result) => sum + result.sub_total, 0);

      // Category-wise subtotals
      const expenseCategoryWiseSubTotal = combinedResults.reduce((acc, result) => {
        const { expense_category_id, sub_total } = result;
        acc[expense_category_id] = (acc[expense_category_id] || 0) + sub_total;
        return acc;
      }, {});

      const incomeCategoryWiseSubTotal = combinedResultsIncome.reduce((acc, result) => {
        const { income_category_id, sub_total } = result;
        acc[income_category_id] = (acc[income_category_id] || 0) + sub_total;
        return acc;
      }, {});

      res.json({
        searchResults: combinedResults,
        incomeSearch: combinedResultsIncome,
        subTotal: sub_total,
        subTotalIncome: sub_totalIncome,
        expenseCategorySubTotal: expenseCategoryWiseSubTotal,
        incomeCategorySubTotal: incomeCategoryWiseSubTotal,
      });
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "An error occurred during search." });
  }
});



const smsApiModel = require('../app/model/Admin/sms_api_model/sms_api_model')
app.post("/Admin/sms_api/sms_api_create", smsApiModel.create_sms_api
);
app.get("/Admin/sms_api/sms_api_all", smsApiModel.sms_api_list
);
app.get("/Admin/sms_api/sms_api_all/:id", smsApiModel.sms_api_list_single
);
app.post("/Admin/sms_api/sms_api_edit/:id", smsApiModel.sms_api_update
);
app.post("/Admin/sms_api/sms_api_delete/:id", smsApiModel.sms_api_delete
);
app.get("/Admin/all_table", smsApiModel.all_table_list
);

// npm uninstall react-html-table-to-excel

app.get('/api/balance', async (req, res) => {
  const { url } = req.query; // Extract apiKey and url from the query parameters
  console.log(url)
  if (!url) {
    return res.status(400).json({ error: 'API  URL are required' });
  }

  try {
    const response = await fetch(`${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

const connection = require('../connection/config/database')


app.get('/absent/absent_online_entry_employee', (req, res) => {
  let start = new Date();
  let data_error = [];


  if (req.method === 'GET') {

    const attendance_date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    db.query("SELECT * FROM yearly_holiday WHERE start_date = ?", [attendance_date], (err, holiday) => {
      if (err) {
        data_error.push({ holiday_error: err });
        return res.json(data_error);
      }

      if (holiday.length > 0) {
        let msg = `Today ${attendance_date}, ${holiday[0].holiday_name} is a holiday. You can't take attendance today.`;
        data_error.push({ holiday_msg: msg });
        return res.json(data_error);
      }
      else {
        // Leave approved users
        let lv_query = `
            SELECT GROUP_CONCAT(whose_leave) AS user_id
            FROM leave_application
            LEFT JOIN leave_application_date ON leave_application.id = leave_application_date.leave_application_id
            WHERE leave_application.application_status = 2
              AND leave_application_date.leave_date = ?
          `;

        db.query(lv_query, [attendance_date], (err, lv_users) => {
          if (err) {
            data_error.push({ lv_error: err });
            return res.json(data_error);
          }
          console.log(lv_users, 'lv_users')

          let lv_users_id = lv_users[0].user_id || '';

          // Attendance users
          db.query("SELECT GROUP_CONCAT(DISTINCT user_id) AS att_user_id FROM attendance WHERE attendance_date = ?", [attendance_date], (err, att_users) => {
            if (err) {
              data_error.push({ att_error: err });
              return res.json(data_error);
            }
            console.log(att_users)
            let att_users_id = att_users[0].att_user_id || '';
            let not_in_users = [lv_users_id, att_users_id].filter(Boolean).join(',');

            let whereClause = not_in_users ?
              `users.status = 1 AND users.role_name IN (1) AND users.id NOT IN (${not_in_users})` :
              `users.status = 1 AND users.role_name IN (1)`;

            // Absent users id
            db.query(`SELECT GROUP_CONCAT(id) AS user_id FROM users WHERE ${whereClause}`, (err, absent_users) => {
              if (err) {
                data_error.push({ absent_error: err });
                return res.json(data_error);
              }
              console.log(absent_users, 'absent_users')
              let absent_users_id = absent_users[0].user_id || '';
              let absent_id_arr = absent_users_id.split(',').map(id => id.trim());
              let absent_count = absent_id_arr.length;
              console.log(absent_users_id, 'absent_users_id')



              if (absent_count > 0) {

                let current_time = new Date().toLocaleTimeString('en-GB', { hour12: false });

                let data4 = [];
                console.log(data4, 'data4 919')
                let processAbsentUsers = absent_id_arr.map((user_id, index) => {
                  return new Promise((resolve, reject) => {
                    db.query("SELECT user_id FROM absent WHERE absent_date = ? AND user_id = ?", [attendance_date, user_id], (err, absent_exists) => {
                      if (err) {
                        data_error.push({ absent_exists_error: err });
                        console.log(absent_exists, 'absent_exists')
                        reject(err);
                      } else if (absent_exists.length === 0) {
                        db.query("SELECT school_shift_id FROM employee_promotion WHERE user_id = ?", [user_id], (err, user_shift) => {
                          if (err) {
                            data_error.push({ user_shift_error: err });
                            reject(err);
                          } else {


                            console.log(user_shift, 'user_shift')
                            console.log(user_id, 'user_shift')
                            let users_shift = user_shift[0]?.school_shift_id?.split(',');
                            let user_shift_ids = users_shift?.map(shift_id => parseInt(shift_id));
                            console.log(users_shift)
                            let promises = user_shift_ids?.map(shift_id => {
                              return new Promise((resolveShift, rejectShift) => {
                                db.query("SELECT MAX(late_time) AS max_late_time, MAX(end_time) AS max_end_time FROM school_shift WHERE id = ?", [shift_id], (err, shift_times) => {
                                  if (err) {
                                    data_error.push({ shift_time_error: err });
                                    rejectShift(err);
                                  } else {
                                    console.log(shift_times, 'shift_times', '945')
                                    let max_late_time = shift_times[0].max_late_time;
                                    let max_end_time = shift_times[0].max_end_time;
                                    console.log(data4, '950')
                                    console.log(max_late_time, 'shift_times', '945')
                                    console.log(max_end_time, 'shift_times', '945')
                                    console.log(current_time, 'shift_times', '945')
                                    // (max_late_time < current_time && max_end_time > current_time
                                    if (max_late_time && max_end_time) {
                                      data4.push({
                                        user_id: user_id,
                                        created_by: null,
                                        absent_date: attendance_date,
                                        device_id: "Online",
                                        shift_id: shift_id
                                      });
                                      console.log(data4, 'data4, 961')
                                    }
                                    resolveShift();
                                  }
                                });
                              });
                            });

                            Promise.all(promises).then(() => resolve()).catch(err => reject(err));
                          }
                        });
                      } else {
                        data_error.push({ absent_exists: `Absent exists for user id ${user_id}` });
                        resolve();
                      }
                    });
                  });
                });

                Promise.all(processAbsentUsers)

                  .then(() => {
                    if (data4.length > 0) {
                      console.log(data4, 'data4 978');

                      // Insert data into the absent table
                      db.query(
                        "INSERT INTO absent (user_id, created_by, absent_date, device_id, shift_id) VALUES ?",
                        [data4.map(item => Object.values(item))],
                        (err) => {
                          if (err) {
                            data_error.push({ insert_absent_error: err });
                          } else {
                            // Get all the inserted user_ids from data4
                            const insertedUserIds = data4.map(item => item.user_id);

                            // Retrieve the inserted records from the absent table
                            db.query(
                              "SELECT * FROM absent WHERE user_id IN (?) AND absent_date = ?",
                              [insertedUserIds, attendance_date],
                              (err, inserted_absent_data) => {
                                if (err) {
                                  data_error.push({ absent_data_retrieve_error: err });
                                } else {
                                  console.log(inserted_absent_data, 'inserted_absent_data 1029');

                                  // Send SMS to absent users
                                  let absent_users_query = `
                  SELECT GROUP_CONCAT(DISTINCT user_id) AS ab_user_id 
                  FROM absent 
                  WHERE absent_date = ? AND user_id IN (${absent_users_id})`;

                                  db.query(absent_users_query, [attendance_date], (err, absent_data) => {
                                    if (err) {
                                      data_error.push({ absent_data_error: err });
                                    } else {
                                      let users_id_arr = absent_data[0].ab_user_id.split(',');
                                      // Call the SMS sending function
                                      teacherEmployeeAbsentSmsSubmitAuto(users_id_arr, attendance_date, inserted_absent_data);
                                    }
                                  });
                                }
                                res.json({ inserted_absent_data, message: data_error });
                              }
                            );
                          }
                        }
                      );
                    } else {
                      data_error.push({ absent_msg: "Absent data array is empty" });
                      res.json(data_error);
                    }
                  });

              } else {
                data_error.push({ absent_count_msg: "Absent count is 0" });
                res.json(data_error);
              }
            });
          });
        });
      }
    });

  } else {
    data_error.push({ request_msg: "Not a GET request" });
    res.json(data_error);
  }

  let end = new Date();
  let diff_seconds = Math.abs((end - start) / 1000) + " seconds";
  data_error.push({ api_exec_time: diff_seconds });
});




// const axios = require('axios'); // Import axios for API requests

// Function to fetch API data
// async function fetchApiData() {
//   try {
//     const res = await axios.get(`http://localhost/:5002/Admin/sms_api/sms_api_all`);
//     const apiData = res.data; // Axios stores response data in the 'data' property
//     return apiData;
//   } catch (error) {
//     console.error('Error fetching API data:', error);
//     return [];
//   }
// }

// // Main function to handle the API URL construction and fetch
// async function processApiData() {
//   const apiData = await fetchApiData(); // Fetching API data

//   // Filter apiData for entries with status_url === '1'
//   const filteredApiData = apiData.filter(item => item.status_url === '1');

//   // Check if there are any valid entries after filtering
//   if (filteredApiData.length === 0 || !filteredApiData[0].sms_api_params || filteredApiData[0].sms_api_params.length === 0) {
//     console.log('No valid data available');
//     return;
//   }

//   // Use the first valid entry for further processing
//   const apiEntry = filteredApiData[0];

//   // Sort the sms_api_params based on the options field
//   const sortedParams = apiEntry.sms_api_params.sort((a, b) => a.options - b.options);

//   // Construct the query string from the sorted parameters
//   const queryParams = sortedParams.map(param => {
//     const key = param.options === 1 ? 'mobile' : (param.sms_key === 'number' ? 'mobile' : param.sms_key);
//     return `${key}=${encodeURIComponent(param.sms_value)}`;
//   }).join('&');

//   // Final URL for API call
//   const constructedUrl = `${apiEntry.main_url}${queryParams}`;
//   console.log('Constructed API URL:', constructedUrl); // Log the constructed URL

//   // Define a flag or condition to prevent automatic API call
//   const shouldFetch = false; // Change this based on your logic

//   if (shouldFetch) {
//     // Fetching the API data
//     try {
//       const response = await axios.get(constructedUrl);
//       console.log('API Response:', response.data); // Axios stores the response data in 'data'
//     } catch (error) {
//       console.error('Error fetching the constructed URL:', error);
//     }
//   }
// }

// Call the main function to execute the logic
// processApiData();

// app.get("/Admin/sms_api/sms_api_all_status_1", processApiData
// );

async function fetchApiData() {
  try {
    const response = await axios.get(`http://localhost/:5002/Admin/sms_api/sms_api_all`);
    return response.data; // Return the data fetched from the API
  } catch (error) {
    console.error('Error fetching API data:', error);
    throw error; // Handle and propagate the error
  }
}

// This function is responsible for sending the SMS
async function sendSms(mobile, msg) {
  try {
    // Fetch the SMS API data
    const apiData = await fetchApiData();

    // Filter the API data for entries with status_url === '1'
    const filteredApiData = apiData.filter(item => item.status_url === '1');

    // If no valid API data is found, return or throw an error
    if (filteredApiData.length === 0 || !filteredApiData[0].sms_api_params || filteredApiData[0].sms_api_params.length === 0) {
      throw new Error('No valid API data found for sending SMS');
    }

    // Use the first valid entry for further processing
    const apiEntry = filteredApiData[0];

    // Sort the sms_api_params based on the options field
    const sortedParams = apiEntry.sms_api_params.sort((a, b) => a.options - b.options);

    // Construct the query string from the sorted parameters
    const queryParams = sortedParams.map(param => {
      const key = param.options === 1 ? 'mobile' : (param.sms_key === 'number' ? 'mobile' : param.sms_key);
      return `${key}=${encodeURIComponent(param.sms_value)}`;
    }).join('&');

    // Construct the final URL for the API call
    const constructedUrl = `${apiEntry.main_url}${queryParams}`;
    const [baseUrl, paramString] = constructedUrl.split('?');

    // Check if paramString is defined before attempting to split
    const firstParam = paramString ? paramString.split('&')[0] : null;

    let formattedUrl;
    if (firstParam) {
      // Construct the formatted URL using the base URL and the first parameter
      formattedUrl = `${baseUrl}?${firstParam}`;
    } else {
      console.log('No parameters found.');
      return;
    }

    console.log('Formatted URL:', formattedUrl);
    // Make the API request to send the SMS
    const response = await axios.get(formattedUrl, {
      params: {
        mobile,
        msg,
      },
    });

    // Log and return the response from the SMS API
    console.log('SMS sent:', response.data);
    return response.data;

  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error sending SMS:', error);
    throw error;
  }
}
// async function sendSms(mobile, msg) {


//   const quick_api = '7ae89887eac6055a2b9adc494ca3b902';
//   const apiUrl = 'https://quicksmsapp.com/Api/sms/campaign_api';
//   try {
//     const response = await axios.get(apiUrl, {
//       params: {
//         quick_api,
//         mobile,
//         msg,
//       },
//     });
//     console.log('SMS sent:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw error;
//   }
// }

// app.get('/all_data', sendSms)

async function teacherEmployeeAbsentSmsSubmitAuto(usersIdArr, absentDate, inserted_absent_data) {

  const smsMessages = [];

  for (let userId of usersIdArr) {
    try {
      // Fetch user details and attendance
      const userResult = await new Promise((resolve, reject) => {
        const query = `
          SELECT users.id, users.unique_id, users.full_name, users.mobile, users.created_date, 
                 DATE(attendance.checktime) AS date, TIME(MAX(attendance.checktime)) AS max_time, 
                 TIME(MIN(attendance.checktime)) AS min_time, designation.designation_name 
          FROM users 
          LEFT JOIN attendance ON attendance.user_id = users.id 
          LEFT JOIN employee_promotion ON employee_promotion.user_id = users.id 
          LEFT JOIN designation ON designation.id = employee_promotion.designation_id 
          WHERE users.id = ? 
          GROUP BY users.id, attendance.user_id`;
        connection.query(query, [userId], (error, result) => {
          if (error) {
            console.error(`Error fetching user data for userId ${userId}:`, error);
            return reject(error);
          }
          resolve(result);
        });
      });

      if (userResult.length === 0 || !userResult[0].mobile) {
        console.log(`Mobile not found for user ${userId}`);
        continue;
      }

      const content = userResult[0];

      // Fetch SMS settings
      const smsSettingsRow = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM sms_settings WHERE id = 1';
        db.query(query, (error, result) => {
          if (error) {
            console.error(`Error fetching SMS settings for userId ${userId}:`, error);
            return reject(error);
          }
          resolve(result[0]);
        });
      });

      if (smsSettingsRow.sms_system !== 1 || smsSettingsRow.auto_te_absence !== 1) {
        console.log(`SMS system or auto absence not enabled for user ${userId}`);
        continue;
      }

      // Check if absence SMS already exists
      const absentData = await new Promise((resolve, reject) => {
        const query = 'SELECT id FROM absent_sms WHERE user_id = ? AND absent_date = ?';
        db.query(query, [userId, absentDate], (error, result) => {
          if (error) {
            console.error(`Error checking absent data for userId ${userId}:`, error);
            return reject(error);
          }
          resolve(result);
        });
      });

      if (absentData.length === 0) {


        // Prepare the SMS message
        const predefinedVar = [
          '[[company_name]]',
          '[[full_name]]',
          '[[date]]',
          '[[sms_time]]',
          '[[teacher/employee_id]]',
          '[[teacher/employee_designation]]',
        ];

        const replacedVar = [
          'No Company',
          content.full_name,
          absentDate,
          absentDate,
          content.unique_id,
          content.designation_name,
          new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })
        ];

        let teAbsenceSms = smsSettingsRow?.te_absence;
        predefinedVar.forEach((varItem, index) => {
          teAbsenceSms = teAbsenceSms?.replace(varItem, replacedVar[index]);
        });




        smsMessages.push({ user_id: userId, message: teAbsenceSms, mobile: content.mobile });

        // Send SMS directly
        if (smsSettingsRow.te_absent_shift !== '' && smsSettingsRow.te_absent_shift_enable == 1)
          try {
            await sendSms(content.mobile, teAbsenceSms);
          } catch (error) {
            console.error(`Error sending SMS for userId ${userId}:`, error);
          }
      }
    } catch (error) {
      console.error(`Error processing userId ${userId}:`, error);
    }
  }

  // Insert SMS campaign
  employeeAbsentSmsDataInsert(usersIdArr, smsMessages, absentDate, inserted_absent_data);
}

async function employeeAbsentSmsDataInsert(usersIdArr, smsMessages, absentDate, inserted_absent_data) {
  const totalNumber = usersIdArr.length;
  const smsCampaignData = {
    name: 'teacher_employee_absent',
    category: 'Enter Number',
    created_by: 6,
    one_time: 1,
    total_number: totalNumber,
    status: 2
  };

  try {
    const insertCampaign = await new Promise((resolve, reject) => {
      db.query('INSERT INTO sms_campaign SET ?', smsCampaignData, (error, result) => {
        if (error) {
          console.error(`Error inserting SMS campaign:`, error);
          return reject(error);
        }
        resolve(result);
      });
    });
    const campaignId = insertCampaign.insertId;

    // Insert SMS campaign logs
    const smsCampaignLogData = smsMessages.map(smsData => ({
      campaign_id: campaignId,
      category: 'Enter Number',
      sender_id: 6,
      status: 2,
      user_id: smsData.user_id,
      campaign_category: 19,
      message: smsData.message,
      number: smsData.mobile,
      response: 'Delivered'
    }));

    await new Promise((resolve, reject) => {
      db.query('INSERT INTO sms_campaign_log (campaign_id, category, sender_id, status, user_id, campaign_category, message, number, response) VALUES ?', [smsCampaignLogData.map(Object.values)], (error, result) => {
        if (error) {
          console.error(`Error inserting SMS campaign logs:`, error);
          return reject(error);
        }
        resolve(result);
      });
    });

    // Get inserted campaign log IDs
    const logIds = await new Promise((resolve, reject) => {
      const query = `SELECT GROUP_CONCAT(id) as sms_log_id FROM sms_campaign_log WHERE campaign_id = ?`;
      db.query(query, [campaignId], (error, result) => {
        if (error) {
          console.error(`Error fetching SMS log IDs for campaignId ${campaignId}:`, error);
          return reject(error);
        }
        resolve(result[0].sms_log_id.split(','));
      });
    });

    const absentIdLookup = inserted_absent_data.reduce((lookup, record) => {
      lookup[record.user_id] = record.id;
      return lookup;
    }, {});
    // Insert absent SMS
    const absentSmsData = usersIdArr.map((userId, index) => ({
      user_id: userId,
      absent_date: absentDate,
      sms_campaign_log_id: logIds[index],
      absent_id: absentIdLookup[userId]

    }));



    await new Promise((resolve, reject) => {
      db.query('INSERT INTO absent_sms (user_id, absent_date, sms_campaign_log_id, absent_id) VALUES ?', [absentSmsData.map(Object.values)], (error, result) => {
        if (error) {
          console.error(`Error inserting absent SMS data:`, error);
          return reject(error);
        }
        resolve(result);
      });
    });

  } catch (error) {
    console.error('Error during SMS campaign creation or logging:', error);
  }
}

















// const quick_api = '7ae89887eac6055a2b9adc494ca3b902'
// const smsEncode = encodeURIComponent(teAbsenceSms);
// const smsApiParam = `?quick_api=${quick_api}&mobile=${content.mobile}&msg=${smsEncode}`;
// const apiUrl = `https://quicksmsapp.com/Api/sms/campaign_api${smsApiParam}`;
// apiData.push(apiUrl);

// const axios = require('axios'); // Make sure to import axios if not already imported

// async function sendSms(mobile, msg) {
//   const quick_api = '7ae89887eac6055a2b9adc494ca3b902';
//   const apiUrl = 'https://quicksmsapp.com/Api/sms/campaign_api';
//   try {
//     const response = await axios.get(apiUrl, {
//       params: {
//         quick_api,
//         mobile,
//         msg,
//       },
//     });
//     console.log('SMS sent:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw error;
//   }
// }
// async function teacherEmployeeAbsentSmsSubmitAuto(usersIdArr, absentDate) {

//   const smsApi = sendSms();
//   const apiData = [];
//   const smsMessages = [];

//   console.log(smsMessages)
//   console.log(apiData)
//   for (let userId of usersIdArr) {
//     try {
//       // Fetch user details and attendance
//       const userResult = await new Promise((resolve, reject) => {
//         const query = `
//           SELECT users.id, users.unique_id, users.full_name, users.mobile, users.created_date, 
//                  DATE(attendance.checktime) AS date, TIME(MAX(attendance.checktime)) AS max_time, 
//                  TIME(MIN(attendance.checktime)) AS min_time, designation.designation_name 
//           FROM users 
//           LEFT JOIN attendance ON attendance.user_id = users.id 
//           LEFT JOIN employee_promotion ON employee_promotion.user_id = users.id 
//           LEFT JOIN designation ON designation.id = employee_promotion.designation_id 
//           WHERE users.id = ? 
//           GROUP BY users.id, attendance.user_id`;
//         connection.query(query, [userId], (error, result) => {
//           if (error) {
//             console.error(`Error fetching user data for userId ${userId}:`, error);
//             return reject(error);
//           }
//           resolve(result);
//         });
//       });

//       if (userResult.length === 0 || !userResult[0].mobile) {
//         console.log(`Mobile not found for user ${userId}`);
//         continue;
//       }

//       const content = userResult[0];

//       // Fetch SMS settings
//       const smsSettingsRow = await new Promise((resolve, reject) => {
//         const query = 'SELECT * FROM sms_settings WHERE id = 1';
//         db.query(query, (error, result) => {
//           if (error) {
//             console.error(`Error fetching SMS settings for userId ${userId}:`, error);
//             return reject(error);
//           }
//           resolve(result[0]);
//         });
//       });

//       if (smsSettingsRow.sms_system !== 1 || smsSettingsRow.auto_te_absence !== 1) {
//         console.log(`SMS system or auto absence not enabled for user ${userId}`);
//         continue;
//       }

//       // Check if absence SMS already exists
//       const absentData = await new Promise((resolve, reject) => {
//         const query = 'SELECT id FROM absent_sms WHERE user_id = ? AND absent_date = ?';
//         db.query(query, [userId, absentDate], (error, result) => {
//           if (error) {
//             console.error(`Error checking absent data for userId ${userId}:`, error);
//             return reject(error);
//           }
//           resolve(result);
//         });
//       });

//       if (absentData.length === 0) {
//         // Fetch user shift
//         const usersShiftRow = await new Promise((resolve, reject) => {
//           const query = 'SELECT school_shift_id FROM employee_promotion WHERE user_id = ?';
//           db.query(query, [userId], (error, result) => {
//             if (error) {
//               console.error(`Error fetching shift data for userId ${userId}:`, error);
//               return reject(error);
//             }
//             resolve(result);
//           });
//         });

//         const usersShiftArr = usersShiftRow[0].school_shift_id.split(',');
//         console.log(usersShiftArr, 'usersShiftArr 1135')
//         // Prepare the SMS message
//         const predefinedVar = [
//           '[[company_name]]',
//           '[[full_name]]',
//           '[[teacher/employee_id]]',
//           '[[teacher/employee_designation]]',
//           '[[absent_date]]',
//           '[[sms_time]]'
//         ];

//         const replacedVar = [
//           'companyInfo().name',
//           content.full_name,
//           content.unique_id,
//           content.designation_name,
//           absentDate,
//           new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })
//         ];
//         console.log(replacedVar)
//         let teAbsenceSms = smsSettingsRow?.te_absence;
//         predefinedVar.forEach((varItem, index) => {
//           teAbsenceSms = teAbsenceSms?.replace(varItem, replacedVar[index]);
//         });

//         const smsEncode = encodeURIComponent(teAbsenceSms);
//         const smsApiParam = smsApi.sms_api_param?.replace(smsApi.sms_num, content.mobile).replace(smsApi.sms_msg, smsEncode);
//         const apiUrl = `${smsApi.main_url}${smsApiParam}`;

//         apiData?.push(apiUrl);
//         smsMessages?.push({ user_id: userId, message: teAbsenceSms, mobile: content.mobile });
//       }
//     } catch (error) {
//       console.error(`Error processing userId ${userId}:`, error);
//     }
//   }

//   // Send SMS via axios
//   for (let url of apiData) {
//     try {
//       await axios.get(url);
//     } catch (error) {
//       console.error(`Error sending SMS:`, error);
//     }
//   }

//   // Insert SMS campaign
//   const totalNumber = usersIdArr.length;
//   const smsCampaignData = {
//     name: 'teacher_employee_absent',
//     category: 'Enter Number',
//     created_by: 6,
//     one_time: 1,
//     total_number: totalNumber,
//     status: 2
//   };

//   try {
//     const insertCampaign = await new Promise((resolve, reject) => {
//       db.query('INSERT INTO sms_campaign SET ?', smsCampaignData, (error, result) => {
//         if (error) {
//           console.error(`Error inserting SMS campaign:`, error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });
//     const campaignId = insertCampaign.insertId;

//     // Insert SMS campaign logs
//     const smsCampaignLogData = smsMessages.map(smsData => ({
//       campaign_id: campaignId,
//       category: 'Enter Number',
//       sender_id: 6,
//       status: 2,
//       user_id: smsData.user_id,
//       campaign_category: 19,
//       message: smsData.message,
//       number: smsData.mobile,
//       response: 'Delivered'
//     }));

//     console.log(smsCampaignLogData, 'smsCampaignLogData 1217')

//     await new Promise((resolve, reject) => {
//       db.query('INSERT INTO sms_campaign_log (campaign_id, category, sender_id, status, user_id, campaign_category, message, number, response) VALUES ?', [smsCampaignLogData.map(Object.values)], (error, result) => {
//         if (error) {
//           console.error(`Error inserting SMS campaign logs:`, error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });

//     // Get inserted campaign log IDs
//     const logIds = await new Promise((resolve, reject) => {
//       const query = `SELECT GROUP_CONCAT(id) as sms_log_id FROM sms_campaign_log WHERE campaign_id = ?`;
//       db.query(query, [campaignId], (error, result) => {
//         if (error) {
//           console.error(`Error fetching SMS log IDs for campaignId ${campaignId}:`, error);
//           return reject(error);
//         }
//         resolve(result[0].sms_log_id.split(','));
//       });
//     });

//     // Insert absent SMS
//     const absentSmsData = usersIdArr.map((userId, index) => ({
//       user_id: userId,
//       absent_date: absentDate,
//       sms_campaign_log_id: logIds[index]
//     }));

//     await new Promise((resolve, reject) => {
//       db.query('INSERT INTO absent_sms (user_id, absent_date, sms_campaign_log_id) VALUES ?', [absentSmsData.map(Object.values)], (error, result) => {
//         if (error) {
//           console.error(`Error inserting absent SMS data:`, error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });

//   } catch (error) {
//     console.error('Error during SMS campaign creation or logging:', error);
//   }
// }














// async function teacherEmployeeAbsentSmsSubmitAuto(usersIdArr, absentDate) {
//   const smsApi = sendSms();
//   const apiData = [];
//   const smsMessages = [];

//   for (let userId of usersIdArr) {
//     try {
//       // Fetch user details and attendance
//       const userResult = await new Promise((resolve, reject) => {
//         const query = `
//           SELECT users.id, users.unique_id, users.full_name, users.mobile, users.created_date, 
//                  DATE(attendance.checktime) AS date, TIME(MAX(attendance.checktime)) AS max_time, 
//                  TIME(MIN(attendance.checktime)) AS min_time, designation.designation_name 
//           FROM users 
//           LEFT JOIN attendance ON attendance.user_id = users.id 
//           LEFT JOIN employee_promotion ON employee_promotion.user_id = users.id 
//           LEFT JOIN designation ON designation.id = employee_promotion.designation_id 
//           WHERE users.id = ? 
//           GROUP BY users.id, attendance.user_id`;
//         connection.query(query, [userId], (error, result) => {
//           if (error) {
//             console.error(`Error fetching user data for userId ${userId}:`, error);
//             return reject(error);
//           }
//           resolve(result);
//         });
//       });

//       if (userResult.length === 0 || !userResult[0].mobile) {
//         console.log(`Mobile not found for user ${userId}`);
//         continue;
//       }

//       const content = userResult[0];

//       // Fetch SMS settings
//       const smsSettingsRow = await new Promise((resolve, reject) => {
//         const query = 'SELECT * FROM sms_settings WHERE id = 1';
//         db.query(query, (error, result) => {
//           if (error) {
//             console.error(`Error fetching SMS settings for userId ${userId}:`, error);
//             return reject(error);
//           }
//           resolve(result[0]);
//         });
//       });

//       if (smsSettingsRow.sms_system !== 1 || smsSettingsRow.auto_te_absence !== 1) {
//         console.log(`SMS system or auto absence not enabled for user ${userId}`);
//         continue;
//       }

//       // Check if absence SMS already exists
//       const absentData = await new Promise((resolve, reject) => {
//         const query = 'SELECT id FROM absent_sms WHERE user_id = ? AND absent_date = ?';
//         db.query(query, [userId, absentDate], (error, result) => {
//           if (error) {
//             console.error(`Error checking absent data for userId ${userId}:`, error);
//             return reject(error);
//           }
//           resolve(result);
//         });
//       });

//       if (absentData.length === 0) {
//         // Fetch user shift
//         const usersShiftRow = await new Promise((resolve, reject) => {
//           const query = 'SELECT school_shift_id FROM employee_promotion WHERE user_id = ?';
//           db.query(query, [userId], (error, result) => {
//             if (error) {
//               console.error(`Error fetching shift data for userId ${userId}:`, error);
//               return reject(error);
//             }
//             resolve(result);
//           });
//         });

//         const usersShiftArr = usersShiftRow[0].school_shift_id.split(',');

//         // Prepare the SMS message
//         const predefinedVar = [
//           '[[company_name]]',
//           '[[full_name]]',
//           '[[teacher/employee_id]]',
//           '[[teacher/employee_designation]]',
//           '[[absent_date]]',
//           '[[sms_time]]'
//         ];

//         const replacedVar = [
//           'companyInfo().name',
//           content.full_name,
//           content.unique_id,
//           content.designation_name,
//           absentDate,
//           new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })
//         ];

//         let teAbsenceSms = smsSettingsRow.te_absence;
//         predefinedVar.forEach((varItem, index) => {
//           teAbsenceSms = teAbsenceSms?.replace(varItem, replacedVar[index]);
//         });

//         const smsEncode = encodeURIComponent(teAbsenceSms);
//         const smsApiParam = smsApi.sms_api_param?.replace(smsApi.sms_num, content.mobile).replace(smsApi.sms_msg, smsEncode);
//         const apiUrl = `${smsApi.main_url}${smsApiParam}`;

//         apiData.push(apiUrl);
//         smsMessages.push({ user_id: userId, message: teAbsenceSms, mobile: content.mobile });
//       }
//     } catch (error) {
//       console.error(`Error processing userId ${userId}:`, error);
//     }
//   }

//   // Send SMS via axios
//   for (let url of apiData) {
//     try {
//       await axios.get(url);
//     } catch (error) {
//       console.error(`Error sending SMS:`, error);
//     }
//   }

//   // Insert SMS campaign
//   const totalNumber = usersIdArr.length;
//   const smsCampaignData = {
//     name: 'teacher_employee_absent',
//     category: 'Enter Number',
//     created_by: 6,
//     one_time: 1,
//     total_number: totalNumber,
//     status: 2
//   };

//   try {
//     const insertCampaign = await new Promise((resolve, reject) => {
//       db.query('INSERT INTO sms_campaign SET ?', smsCampaignData, (error, result) => {
//         if (error) {
//           console.error(`Error inserting SMS campaign:`, error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });
//     const campaignId = insertCampaign.insertId;

//     // Insert SMS campaign logs
//     const smsCampaignLogData = smsMessages.map(smsData => ({
//       campaign_id: campaignId,
//       category: 'Enter Number',
//       sender_id: 6,
//       status: 2,
//       user_id: smsData.user_id,
//       campaign_category: 19,
//       message: smsData.message,
//       number: smsData.mobile,
//       response: 'Delivered'
//     }));

//     await new Promise((resolve, reject) => {
//       db.query('INSERT INTO sms_campaign_log (campaign_id, category, sender_id, status, user_id, campaign_category, message, number, response) VALUES ?', [smsCampaignLogData.map(Object.values)], (error, result) => {
//         if (error) {
//           console.error(`Error inserting SMS campaign logs:`, error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });

//     // Get inserted campaign log IDs
//     const logIds = await new Promise((resolve, reject) => {
//       const query = `SELECT GROUP_CONCAT(id) as sms_log_id FROM sms_campaign_log WHERE campaign_id = ?`;
//       db.query(query, [campaignId], (error, result) => {
//         if (error) {
//           console.error(`Error fetching SMS log IDs for campaignId ${campaignId}:`, error);
//           return reject(error);
//         }
//         resolve(result[0].sms_log_id.split(','));
//       });
//     });

//     // Insert absent SMS
//     const absentSmsData = usersIdArr.map((userId, index) => ({
//       user_id: userId,
//       absent_date: absentDate,
//       sms_campaign_log_id: logIds[index]
//     }));

//     await new Promise((resolve, reject) => {
//       db.query('INSERT INTO absent_sms (user_id, absent_date, sms_campaign_log_id) VALUES ?', [absentSmsData.map(Object.values)], (error, result) => {
//         if (error) {
//           console.error(`Error inserting absent SMS data:`, error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });

//   } catch (error) {
//     console.error('Error during SMS campaign creation or logging:', error);
//   }
// }

// async function teacherEmployeeAbsentSmsSubmitAuto(usersIdArr, absentDate) {
//   const smsApi = sendSms();
//   const apiData = [];
//   const smsMessages = [];

//   for (let userId of usersIdArr) {

//     console.log(userId, 'userId 1066')
//     // const content = await teacherAbsent(archive);


//     const result = await new Promise((resolve, reject) => {
//       const query = ' SELECT users.id, users.unique_id, users.full_name, users.mobile, users.created_date, DATE(attendance.checktime) AS date, TIME(MAX(attendance.checktime)) AS max_time, TIME(MIN(attendance.checktime)) AS min_time, designation.designation_name FROM users LEFT JOIN attendance ON attendance.user_id = users.id LEFT JOIN employee_promotion ON employee_promotion.user_id = users.id LEFT JOIN designation ON designation.id = employee_promotion.designation_id WHERE users.id = ? GROUP BY users.id, attendance.user_id';
//       connection.query(query, [userId], (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       });
//     });

//     console.log(result[0], 'userId 1069');
//     const content = result[0]
//     console.log(content, 'userId 1069 content')
//     console.log(content.mobile, 'userId 1081 content')
//     if (content && content.mobile) {
//       // Fetch SMS settings
//       const smsSettingsRow = await db.query(`SELECT * FROM sms_settings WHERE id='1'`);
//       if (smsSettingsRow.sms_system === 1) {
//         if (smsSettingsRow.auto_te_absence === 1) {
//           const absentData = await db.query(`SELECT id FROM absent_sms WHERE user_id='${userId}' AND absent_date='${absentDate}'`);
//           console.log(absentData, 'absentData 1079')
//           if (absentData.length === 0) {
//             const usersShiftRow = await db.query(`SELECT school_shift_id FROM employee_promotion WHERE user_id=${userId}`);
//             const usersShiftArr = usersShiftRow[0].school_shift_id.split(',');
//             console.log(usersShiftArr)
//             if (smsSettingsRow.te_one_time === 1) {
//               const predefinedVar = [
//                 '[[company_name]]',
//                 '[[full_name]]',
//                 '[[teacher/employee_id]]',
//                 '[[teacher/employee_designation]]',
//                 '[[absent_date]]',
//                 '[[sms_time]]'
//               ];
//               const replacedVar = [
//                 'companyInfo().name',
//                 content.full_name,
//                 content.unique_id,
//                 content.designation_name,
//                 absentDate,
//                 new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })
//               ];
//               let teAbsenceSms = smsSettingsRow.te_absence;
//               predefinedVar.forEach((varItem, index) => {
//                 teAbsenceSms = teAbsenceSms.replace(varItem, replacedVar[index]);
//               });

//               const smsEncode = encodeURIComponent(teAbsenceSms);
//               const smsApiParam = smsApi.sms_api_param.replace(smsApi.sms_num, content.mobile).replace(smsApi.sms_msg, smsEncode);
//               const apiUrl = `${smsApi.main_url}${smsApiParam}`;
//               apiData.push(apiUrl);
//               smsMessages.push({ user_id: userId, message: teAbsenceSms, mobile: content.mobile });
//             } else {
//               const smsSettingsShiftArr = smsSettingsRow.te_absent_shift.split(',');
//               const commonShifts = usersShiftArr.filter(shift => smsSettingsShiftArr.includes(shift));

//               for (let shift of commonShifts) {
//                 const predefinedVar = [
//                   '[[company_name]]',
//                   '[[full_name]]',
//                   '[[teacher/employee_id]]',
//                   '[[teacher/employee_designation]]',
//                   '[[absent_date]]',
//                   '[[sms_time]]'
//                 ];
//                 const replacedVar = [
//                   companyInfo().name,
//                   content.full_name,
//                   content.unique_id,
//                   content.designation_name,
//                   absentDate,
//                   new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })
//                 ];
//                 let teAbsenceSms = smsSettingsRow.te_absence;
//                 predefinedVar.forEach((varItem, index) => {
//                   teAbsenceSms = teAbsenceSms.replace(varItem, replacedVar[index]);
//                 });

//                 const smsEncode = encodeURIComponent(teAbsenceSms);
//                 const smsApiParam = smsApi.sms_api_param.replace(smsApi.sms_num, content.mobile).replace(smsApi.sms_msg, smsEncode);
//                 const apiUrl = `${smsApi.main_url}${smsApiParam}`;
//                 apiData.push(apiUrl);
//                 smsMessages.push({ user_id: userId, message: teAbsenceSms, mobile: content.mobile });
//               }
//             }
//             msg = "<span class='text-success mt-3'>Delivered</span>";
//           }
//         } else {
//           msg = "<span class='text-danger mt-3'>Teacher/Employee Absent setting not enabled</span>";
//         }
//       } else {
//         msg = "<span class='text-danger mt-3'>SMS system not enabled</span>";
//       }
//     } else {
//       msg = "<span class='text-danger mt-3'>Mobile not found</span>";
//     }
//   }

//   // Send SMS via axios
//   for (let url of apiData) {
//     await axios.get(url);
//   }

//   // Insert SMS campaign
//   const totalNumber = usersIdArr.length;
//   const smsCampaignData = {
//     name: 'teacher_employee_absent',
//     category: 'Enter Number',
//     created_by: 6,
//     one_time: 1,
//     total_number: totalNumber,
//     status: 2
//   };
//   console.log(smsCampaignData, 'smsCampaignData 1191')
//   const insertCampaign = await db.query('INSERT INTO sms_campaign SET ?', smsCampaignData);
//   const campaignId = insertCampaign.insertId;

//   // Insert SMS campaign logs
//   console.log(smsMessages, 'smsMessages 1196')
//   const smsCampaignLogData = smsMessages.map(smsData => ({
//     campaign_id: campaignId,
//     category: 'Enter Number',
//     sender_id: 6,
//     status: 2,
//     user_id: smsData.user_id,
//     campaign_category: 19,
//     message: smsData.message,
//     number: smsData.mobile,
//     response: 'Delivered'
//   }));
//   await db.query('INSERT INTO sms_campaign_log (campaign_id, category, sender_id, status, user_id, campaign_category, message, number, response) VALUES ?', [smsCampaignLogData.map(Object.values)]);

//   // Get inserted campaign log IDs
//   const logIds = await db.query(`SELECT GROUP_CONCAT(id) as sms_log_id FROM sms_campaign_log WHERE campaign_id = '${campaignId}'`);
//   const logIdArr = logIds
//   // const logIdArr = logIds[0].sms_log_id.split(',');

//   // Insert absent SMS
//   const absentSmsData = usersIdArr.map((userId, index) => ({
//     user_id: userId,
//     absent_date: absentDate,
//     sms_campaign_log_id: logIdArr[index]
//   }));
//   await db.query('INSERT INTO absent_sms (user_id, absent_date, sms_campaign_log_id) VALUES ?', [absentSmsData.map(Object.values)]);
// }







// Function to retrieve teacher absentee data
// async function teacherAbsent(userId) {
//   let rowss = [];
//   try {
//     const result = await db.query(`
//       SELECT users.id, users.unique_id, users.full_name, users.mobile, users.created_date,
//       DATE(attendance.checktime) AS date, TIME(MAX(attendance.checktime)) AS max_time,
//       TIME(MIN(attendance.checktime)) AS min_time, designation.designation_name
//       FROM users
//       LEFT JOIN attendance ON attendance.user_id = users.id
//       LEFT JOIN employee_promotion ON employee_promotion.user_id = users.id
//       LEFT JOIN designation ON designation.id = employee_promotion.designation_id
//       WHERE users.id = ?
//       GROUP BY users.id, attendance.user_id
//     `, userId);

//     // Log the result to inspect what is being returned
//     console.log('Query result:', result);

//     // Assuming result is an array, either of rows or [rows, fields]
//     const rows = Array.isArray(result) ? result : result[0];

//     if (rows && rows.length > 0) {
//       rowss.push(rows[0]);
//     } else {
//       console.log('No rows found for user ID:', userId);
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }

//   return rowss;
// }








const smsSettings = require('../app/model/Admin/sms_settings_model/smsSettings')
app.post('/smsSettings', smsSettings.updateSmsSettings)
app.get('/smsSettings/', smsSettings.getSmsSettings)
// app.post('/api/all_table_data', smsSettings.all_table_data)



const path = require('path');

app.get('/get-css/:file', (req, res) => {
  const cssFileName = req.params.file;
  const cssFilePath = path.join(__dirname, 'css', cssFileName);

  // Check if the CSS file exists
  if (fs.existsSync(cssFilePath)) {
    const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
    res.type('text/css').send(cssContent);
  } else {
    res.status(404).json({ error: 'CSS file not found' });
  }
});



const moduleSettings = require('../app/model/Admin/module_settings_model/module_settings_model')
app.post('/Admin/module_settings/module_settings_create', moduleSettings.module_setting_create)
app.get('/Admin/module_settings/module_settings_all', moduleSettings.module_setting_list)


const { default: axios } = require('axios')









// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




app.get('/calculateAmounts', (req, res) => {
  // Query to calculate total payable amount
  const payableQuery = 'SELECT SUM(payable_amount) AS total_payable FROM expense';
  db.query(payableQuery, (err, payableResults) => {
    if (err) {
      console.error('Error calculating total payable amount: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    const totalPayable = payableResults[0].total_payable || 0;

    // Query to calculate total paid amount
    const paidQuery = 'SELECT SUM(paid_amount) AS total_paid FROM expense';
    db.query(paidQuery, (err, paidResults) => {
      if (err) {
        console.error('Error calculating total paid amount: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }

      const totalPaid = paidResults[0].total_paid || 0;

      // Respond with JSON containing total payable and total paid amounts
      res.json({
        totalPayable: totalPayable,
        totalPaid: totalPaid
      });
    });
  });
});





app.post('/reset-password/:id', (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Hash the new password
  const hashedPassword = crypto.createHash('sha1').update(newPassword).digest('hex');

  // Check the current password in the database
  const checkPasswordQuery = 'SELECT password FROM users WHERE id = ?';

  db.query(checkPasswordQuery, [req.params.id], (checkError, checkResults) => {
    if (checkError) {
      console.log('Error checking current password:', checkError);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Check if the current password matches the one in the database
    // const storedPassword = checkResults[0].password;
    // const hashedPasswords = sha1(currentPassword);
    // if (storedPassword !== hashedPasswords) {
    //   console.log('Current password does not match');
    //   res.status(400).send('Current password is incorrect');
    //   return;
    // }

    // Update the password in the database
    // const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
    const updatePasswordQuery = 'UPDATE users SET password = ?, pass_reset = NULL WHERE id = ?';

    db.query(updatePasswordQuery, [hashedPassword, req.params.id], (updateError, updateResults) => {
      if (updateError) {
        console.log('Error resetting password:', updateError);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Password reset successfully');
        res.status(200).send('Password reset successfully');
      }
    });
  });
});






app.get('/api/menu', (req, res) => {
  fetchMenuData(null, (err, result) => {
    if (err) {
      console.error('Error fetching menu data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(result);
  });
});

// Recursive function to fetch hierarchical data
function fetchMenuData(parentId, callback) {
  const query = `
    SELECT
      id,
      title_en,
      title_bn,
      link_path,
      link_path_type,
      active,
      parent_id,
      admin_template_menu_id,
      menu_icon,
      icon_align,
      content_en
    FROM
      admin_template_menu
    WHERE
      parent_id ${parentId ? `= ${parentId}` : 'IS NULL'}
  `;

  db.query(query, (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }

    const menuItems = [];

    // Iterate through the rows
    for (const row of rows) {
      const menuItem = {
        id: row.id,
        title_en: row.title_en,
        title_bn: row.title_bn,
        link_path: row.link_path,
        link_path_type: row.link_path_type,
        active: row.active,
        parent_id: row.parent_id,
        admin_template_menu_id: row.admin_template_menu_id,
        menu_icon: row.menu_icon,
        icon_align: row.icon_align,
        content_en: row.content_en,
        children: [], // Recursive call to fetch children
      };

      fetchMenuData(row.id, (err, children) => {
        if (err) {
          callback(err, null);
          return;
        }

        menuItem.children = children;
        menuItems.push(menuItem);

        // If this is the last row, call the callback
        if (menuItems.length === rows.length) {
          callback(null, menuItems);
        }
      });
    }

    // If there are no rows, call the callback
    if (rows.length === 0) {
      callback(null, menuItems);
    }
  });
}




app.post('/insertData', (req, res) => {
  const items = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  const insertMenuData = (menuData, parentId = null) => {
    menuData.forEach(menu => {
      const { children, ...menuWithoutChildren } = menu;
      const dataToInsert = { ...menuWithoutChildren, parent_id: parentId };

      db.query('INSERT INTO admin_template_menu SET ?', dataToInsert, (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const newParentId = results.insertId;

        if (children && Array.isArray(children) && children.length > 0) {
          insertMenuData(children, newParentId);
        }
      });
    });
  };

  insertMenuData(items);

  res.status(200).json({ success: true });
});

































app.get('/', (req, res) => {
  res.send('Server running saklain mostak')
})


const port =  5002;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})



