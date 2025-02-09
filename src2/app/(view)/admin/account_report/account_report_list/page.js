'use client' 
 //ismile
import React from 'react';
import './accountReport.css';
import Link from 'next/link';

const AccountReportList = () => {


    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">All Account Report</h5>
                                </div>
                                <div className="card-body">
                                    <div class="card-body">
                                        <div class="box">
                                            <div class="row">


                                                <div class="col-md-2 col-sm-3 col-xs-6 report-card">
                                                    <Link class="" href="/Admin/income/transaction_report?page_group=account_management" style={{ textDecoration: 'none' }}>
                                                        <div class="all-report-box zoom-card all-accounts-report text-center p-3 my-3 shadow">
                                                            <div class="images my-3">
                                                                <img src="https://ammkbhs.xyz/web_content/img/chart.png" style={{ width: '50px' }} alt="" />
                                                            </div>
                                                            <h4 style={{ fontSize: '14px', height: '40px', color: '#444', fontWeight: 700 }}
                                                            > Transaction Report  </h4>
                                                        </div>
                                                    </Link>
                                                </div>

                                                <div class="col-md-2 col-sm-3 col-xs-6 report-card">
                                                    <Link class="" href="/Admin/income/accounts_report?page_group=account_management" style={{ textDecoration: 'none' }}>
                                                        <div class="all-report-box zoom-card all-accounts-report text-center p-3 my-3 shadow">
                                                            <div class="images my-3">
                                                                <img src="https://ammkbhs.xyz/web_content/img/chart.png" style={{ width: '50px' }} alt="" />
                                                            </div>
                                                            <h4 style={{ fontSize: '14px', height: '40px', color: '#444', fontWeight: 700 }}
                                                            > Accounts Report  </h4>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div class="col-md-2 col-sm-3 col-xs-6 report-card">
                                                    <Link class="" href="/Admin/income/balance_sheet?page_group=account_management" style={{ textDecoration: 'none' }}>
                                                        <div class="all-report-box zoom-card all-accounts-report text-center p-3 my-3 shadow">
                                                            <div class="images my-3">
                                                                <img src="https://ammkbhs.xyz/web_content/img/chart.png" style={{ width: '50px' }} alt="" />
                                                            </div>
                                                            <h4 style={{ fontSize: '14px', height: '40px', color: '#444', fontWeight: 700 }}
                                                            > Balance Sheet  </h4>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div class="col-md-2 col-sm-3 col-xs-6 report-card">
                                                    <Link class="" href="/Admin/income/general_ledger?page_group=account_management" style={{ textDecoration: 'none' }}>
                                                        <div class="all-report-box zoom-card all-accounts-report text-center p-3 my-3 shadow">
                                                            <div class="images my-3">
                                                                <img src="https://ammkbhs.xyz/web_content/img/chart.png" style={{ width: '50px' }} alt="" />
                                                            </div>
                                                            <h4 style={{ fontSize: '14px', height: '40px', color: '#444', fontWeight: 700 }}
                                                            > Income Statement  </h4>
                                                        </div>
                                                    </Link>
                                                </div>


                                                <div class="col-md-2 col-sm-3 col-xs-6 report-card">
                                                    <Link class="" href="/Admin/income/trial_balance?page_group=account_management" style={{ textDecoration: 'none' }}>
                                                        <div class="all-report-box zoom-card all-accounts-report text-center p-3 my-3 shadow">
                                                            <div class="images my-3">
                                                                <img src="https://ammkbhs.xyz/web_content/img/chart.png" style={{ width: '50px' }} alt="" />
                                                            </div>
                                                            <h4 style={{ fontSize: '14px', height: '40px', color: '#444', fontWeight: 700 }}
                                                            > Trail Balance  </h4>
                                                        </div>
                                                    </Link>
                                                </div>



                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountReportList;












