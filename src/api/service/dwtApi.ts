import axiosClient from '../config/axiosClient.ts';
import axios from 'axios';

export const dwtApi = {
    login: async (email: string, password: string): Promise<any> => {
        const url = 'auth/login';
        return await axiosClient.post(url, {email, password});
    },
    forgetPassword: async (data: any): Promise<any> => {
        const url = 'forget-password';
        return await axiosClient.post(url, data);
    },
    logout: async () => {
        const url = 'auth/logout';
        return await axiosClient.post(url);
    },
    getMe: async (): Promise<any> => {
        const url = 'auth/me';
        return await axiosClient.get(url);
    },
    getUserById: async (id: number): Promise<any> => {
        const url = `users/${id}`;
        return await axiosClient.get(url);
    },

    updateUserById: async (id: number, data: any): Promise<any> => {
        const url = `users/${id}`;
        return await axiosClient.put(url, data);
    },

    //API lấy danh sách các đơn vị tính
    getListUnit: async (): Promise<any> => {
        const url = 'units';
        return await axiosClient.get(url);
    },

    getUnitById: async (id: number): Promise<any> => {
        const url = `units/${id}`;
        return await axiosClient.get(url);
    },

    //API laaysys danh sách tất cả nhân viên
    getListAllUser: async (): Promise<any> => {
        const url = 'users/all';
        return await axiosClient.get(url);
    },

    searchUser: async (params = {}): Promise<any> => {
        const url = 'users';
        return await axiosClient.get(url, {params});
    },
    //API lấy danh sách nhân viên của văn phòng
    getListUserDepartment: async (departmentId: string): Promise<any> => {
        const url = 'users';
        return await axiosClient.get(url, {
            params: {
                departement_id: departmentId,
            },
        });
    },

    getListChildrenDepartment: async (departmentId: string): Promise<any> => {
        const url = `/department-group/get-child-department`;
        return await axiosClient.get(url, {
            params: {
                department_id: departmentId,
            },
        });
    },

    getListDepartmentGroup: async (): Promise<any> => {
        const url = `/department-group`;
        return await axiosClient.get(url);
    },
    //API lấy danh sách doanh nghiệp
    getListDepartment: async (): Promise<any> => {
        const url = 'departments/all';
        return await axiosClient.get(url);
    },

    getDepartmentById: async (id: string): Promise<any> => {
        const url = `departments/${id}`;
        return await axiosClient.get(url);
    },

    //API lấy thông tin chấm công cá nhân theo ngày
    getAttendanceByDate: async (userId: string, date: string): Promise<any> => {
        const url = 'attendances/personal/search';
        return await axiosClient.get(url, {
            params: {
                user_id: userId,
                datetime: date,
            },
        });
    },

    getOfficeWorkDepartment: async (params = {}): Promise<any> => {
        const url = 'mobile/office-diary';
        return await axiosClient.get(url, {params});
    },
    getOfficeWorkPersonal: async (params = {}): Promise<any> => {
        const url = 'mobile/office-diary/self';
        return await axiosClient.get(url, {params});
    },

    //API lấy thông tin Ngày công, Đã nghỉ / vắng, Dự kiến bù - tăng ca(Lấy data theo token đăng nhập)
    getAttendanceInfo: async (): Promise<any> => {
        const url = 'info-attendance/day-of-work-by-user';
        return await axiosClient.get(url);
    },

    //API Lấy SL khen, sự cố, vị phạm
    getRewardAndPunish: async (): Promise<any> => {
        const url = 'rewards-and-punishment/getTotal';
        return await axiosClient.get(url);
    },

    //API Lấy danh sách công việc, lượng điểm
    getWorkListAndPoint: async (): Promise<any> => {
        const url = 'business-standard-history/personal-mobile';
        return await axiosClient.get(url);
    },

    //API lấy danh sách công việc của cá nhân ( key, nonkey)
    getListWork: async (params = {}): Promise<any> => {
        const url = 'business-standard-history/personal';
        return await axiosClient.get(url, {params});
    },

    getWorkDetail: async (
        workId: number,
        userId: number,
        date?: string
    ): Promise<any> => {
        const url = 'business-standard-history/report-detail';
        return await axiosClient.get(url, {
            params: {
                business_standard_id: workId,
                user_id: userId,
                date: date,
            },
        });
    },

    getWorkAriseDetail: async (workId: number, date?: string): Promise<any> => {
        const url = `/business-standard-work-arise/detail/${workId}`;
        return await axiosClient.get(url, {
            params: {
                date: date,
            },
        });
    },

    getOfficeWorkDetail: async (workId: number): Promise<any> => {
        const url = '/mobile/target/details/' + workId;
        return await axiosClient.get(url);
    },

    getOfficeWorkAriseDetail: async (workId: number): Promise<any> => {
        const url = 'mobile/report-task/details/' + workId;
        return await axiosClient.get(url);
    },

    //API lấy danh sách công việc của đơn vị ( key, nonkey)
    getListWorkDepartment: async (params = {}): Promise<any> => {
        const url = 'business-standard-history/department';
        return await axiosClient.get(url, {params});
    },

    //API lấy danh sách công việc phát sinh của cá nhân
    getListWorkArise: async (params = {}): Promise<any> => {
        const url = 'business-standard-work-arise/user-report';
        return await axiosClient.get(url, {params});
    },

    //API lấy danh sách công việc phát sinh của đơn vị
    getListWorkAriseDepartment: async (params = {}): Promise<any> => {
        const url = 'business-standard-work-arise/admin-report';
        return await axiosClient.get(url, {params});
    },

    //API thêm báo cáo cá nhân(Non key, key)
    addPersonalReport: async (data: any): Promise<any> => {
        const url = 'business-standard-report-log/storev3';
        return await axiosClient.post(url, data);
    },

    addPersonalReportArise: async (data: any): Promise<any> => {
        const url = '/business-standard-work-arise/store-report';
        return await axiosClient.post(url, data);
    },

    //API nghiệm thu công việc
    approveWorkBusiness: async (data: any): Promise<any> => {
        const url = '/business-standard-history/report-log-update';
        return await axiosClient.put(url, data);
    },

    approveWorkAriseBussiness: async (data: any): Promise<any> => {
        const url = '/business-standard-work-arise/report-log-update';
        return await axiosClient.put(url, data);
    },

    //API comment cua admin va truong phong
    addCommentWorkBusiness: async (data: any): Promise<any> => {
        const url = '/business-standard-history/store-report';
        return await axiosClient.post(url, data);
    },

    addCommentWorkAriseBusiness: async (id: string, data: any): Promise<any> => {
        const url = `/business-standard-work-arise/update-kpi/${id}`;
        return await axiosClient.post(url, data);
    },

    uploadFile: async (data: any): Promise<any> => {
        const url = 'https://report.sweetsica.com/api/report/upload';
        const formData = new FormData();
        formData.append('files', data);
        const res = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.downloadLink.replace('http://', 'https://');
    },

    getDailyReportDepartment: async (params = {}): Promise<any> => {
        const url = 'daily-report/department';
        return await axiosClient.get(url, {params});
    },

    addWorkArise: async (data: any): Promise<any> => {
        const url = 'business-standard-work-arise/store';
        return await axiosClient.post(url, data);
    },

    getSalaryHistory: async (params = {}): Promise<any> => {
        const url = 'salary-history';
        return await axiosClient.get(url, {params});
    },
    getSalaryById: async (id: string): Promise<any> => {
        const url = 'salary-history/detail/' + id;
        return await axiosClient.get(url);
    },
    getPersonalDailyReport: async (params = {}): Promise<any> => {
        const url = 'daily-report/personal';
        return await axiosClient.get(url, {params});
    },
    createPersonalDailyReport: async (data: any): Promise<any> => {
        const url = 'daily-report/store';
        return await axiosClient.post(url, data);
    },
    getDepartmentDailyReport: async (params = {}): Promise<any> => {
        const url = 'daily-report/department';
        return await axiosClient.get(url, {params});
    },

    // Cham cong
    checkInOut: async (checkIn: string, checkOut?: string) => {
        const url = 'mobile/attendance/store-check-in-out';
        return await axiosClient.post(url, {
            checkIn: checkIn,
            checkOut: checkOut,
        });
    },

    //API lấy thông tin chấm công cá nhân theo ngày
    getCheckInOutByDate: async (userId: number, date: string) => {
        const url = 'attendances/personal/search';
        return await axiosClient.get(url, {
            params: {
                user_id: userId,
                datetime: date,
            },
        });
    },

    //API lấy danh sách chấm công của người dùng theo tháng
    getAttendanceByMonth: async (date: string): Promise<any> => {
        const url = 'mobile/attendance/self';
        return await axiosClient.get(url, {
            params: {
                date: date,
            },
        });
    },
    //API lấy tổng quan chấm công theo phòng ban
    getAttendanceSummaryDepartment: async (params = {}): Promise<any> => {
        const url = 'attendances/department/search';
        return await axiosClient.get(url, {params});
    },

    //API lấy lịch sử chấm công theo phòng ban
    getAttendanceHistoryDepartment: async (params = {}): Promise<any> => {
        const url = 'attendances';
        return await axiosClient.get(url, {params});
    },

    //daily-report báo cáo ngày
    getDailyReportPersonalPerMonth: async (params = {}): Promise<any> => {
        const url = 'daily-report/personal-by-month';
        return await axiosClient.get(url, {params});
    },
    //trang home -> tab quản lý -> sub tab sản xuất:  nhật ký sản xuất ( cái này ngày xưa entity là project work logs) mà giờ đổi thành production diary
    getProductionDiaryPerMonth: async (params = {}): Promise<any> => {
        const url = 'mobile/production-diary/by-month';
        return await axiosClient.get(url, {params});
    },

    getProductionPersonalDiaryByMonth: async (params = {}): Promise<any> => {
        const url = 'mobile/production-diary/personal-by-month';
        return await axiosClient.get(url, {params});
    },

    getListWorkFactoryBySelf: async (params = {}): Promise<any> => {
        const url = 'mobile/production-diary/list-work-of-assignee-by-self';
        return await axiosClient.get(url, {params});
    },
    // trang home -> tab quản lý -> sub tab sản xuất bấm vào 1 cái log
    getProductionDiaryDetail: async (id: number): Promise<any> => {
        const url = `mobile/production-diary/project-work-detail/${id}`;
        return await axiosClient.get(url);
    },

    createProductionReport: async (data: any) => {
        const url = 'project-work-logs';
        return await axiosClient.post(url, data);
    },

    getListMechanicTarget: async (params = {}): Promise<any> => {
        const url = 'mechanic-target/all';
        return await axiosClient.get(url, {params});
    },

    getFactoryPersonalResult: async (params = {}): Promise<any> => {
        const url = 'mobile/production-diary-v2/mechanic-department-result-v2';
        return await axiosClient.get(url, {params});
    },

    getTotalWorkFactory: async (params = {}): Promise<any> => {
        const url = '/mobile/production-diary-v2/total-work';
        return await axiosClient.get(url, {params});
    },


    createNewPropose: async (data: any): Promise<any> => {
        const url = 'quick-reports';
        return await axiosClient.post(url, data);
    },
    getListPersonalPropose: async (params = {}): Promise<any> => {
        const url = 'personal-report';
        return await axiosClient.get(url, {params});
    },
    getListDepartmentPropose: async (params = {}): Promise<any> => {
        const url = 'reports';
        return await axiosClient.get(url, {params});
    },

    //API nghi phep
    getAllAbsencePersonal: async (id: string, params = {}): Promise<any> => {
        const url = `user-leave-web/${id}`;
        return await axiosClient.get(url, {params});
    },

    createAbsence: async (data: any): Promise<any> => {
        const url = 'leave-web';
        return await axiosClient.post(url, data);
    },

    getAllAbsenceManager: async (params = {}): Promise<any> => {
        const url = 'leave-web';
        return await axiosClient.get(url, {params});
    },
    //API KHO VIỆC
    //BE provide work storages api with three different endpoints for 3 roles: admin, manager, user
    //each endpoint has same params so we will create a function to call all of them
    getListJobs: async (role: 'manager' | 'admin' | 'user' = 'user', params = {}): Promise<any> => {
        const url = '/list-job/' + role;
        return await axiosClient.get(url, {params});
    },
    //nhận viêệc
    acceptJob: async (jobId: any): Promise<any> => {
        const url = `/list-job/accept-job/${jobId}`
        return await axiosClient.put(url);
    },

    //API HOP giao ban
    getListMeeting: async (params = {}): Promise<any> => {
        const url = '/mobile/meeting/month/list';
        return await axiosClient.get(url, {params});
    },

    getListMeetingHomePage: async (params = {}): Promise<any> => {
        const url = '/mobile/meeting/list';
        return await axiosClient.get(url, {params});
    },

    getListMeetingPersonalForManager: async (params = {}): Promise<any> => {
        const url = '/mobile/meeting/listIndividual';
        return await axiosClient.get(url, {params});
    },

    getMeetingById: async (id: number): Promise<any> => {
        const url = `/mobile/meeting/show/${id}`;
        return await axiosClient.get(url);
    },

    getMainTarget: async () => {
        const url = '/main-target';
        return await axiosClient.get(url);
    },

    getTotalTmpMainTarget: async (group: 'office' | 'mechanic' | 'business', date: string) => {
        const url = `/mobile/statistic/${group}`;
        return await axiosClient.get(url, {
            params: {
                date: date,
            },
        });
    },

    createOfficeAriseReport: async (data: any): Promise<any> => {
        const url = '/report-tasks-logs';
        return await axiosClient.post(url, data);
    },

    createOfficeTargetLog: async (data: any): Promise<any> => {
        const url = '/target-logs';
        return await axiosClient.post(url, data);
    },

    createOfficeTargetLogDetail: async (data: any): Promise<any> => {
        const url = '/target-log-details';
        return await axiosClient.post(url, data);
    },

    editOfficeTargetLogDetail: async (id: number, data: any): Promise<any> => {
        const url = `/target-log-details/${id}`;
        return await axiosClient.put(url, data);
    },

    editOfficeAriseReport: async (id: number, data: any): Promise<any> => {
        const url = `/report-tasks-logs/${id}`;
        return await axiosClient.put(url, data);
    },

    getListCustomer: async (params = {}): Promise<any> => {
        const url = '/mobile/customer/list';
        return await axiosClient.get(url, {params});
    },

    createCustomer: async (data: any): Promise<any> => {
        const url = '/mobile/customer/store';
        return await axiosClient.post(url, data);
    },

    getListRewardPunish: async (params = {}): Promise<any> => {
        const url = '/rewards-and-punishment';
        return await axiosClient.get(url, {params});
    },

    createRewardPunish: async (data: any): Promise<any> => {
        const url = '/rewards-and-punishment/store';
        return await axiosClient.post(url, data);
    },

    getHomeLeftBarData: async (): Promise<any> => {
        const url = 'info-attendance/statistic-by-day';
        return await axiosClient.get(url);
    }
};
