export const LIST_FACTORY_DEPARTMENT = [
    14,
    15,
    16,
    17,
    21,
    59,
    60,
    66,
    67,
    57,
    56,
    61,
    62,
    63
]

export const LIST_OFFICE_DEPARTMENT = [
    77,
    2,
    3,
    10,
    58,
    36,
    44,
    46,
    68,
    69,
    70,
    71,
    47,
    55,
    72,
    73,
    64,
    65
]

export const LIST_BUSINESS_DEPARTMENT = [
    48,
    49,
    50,
    51,
    52,
    53,
    75,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    101,
    117,
    100,
    102,
    103,
    118,
    104,
    105,
    106,
    116,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115
]

export const WORK_OFFICE_STATUS_COLOR = {
    '1': '#FFF',
    '2': '#FEF08A',
    '3': '#BFDBFE',
    '4': '#F6C9C4',
};

export const WORK_STATUS_COLOR = {
    '1': '#FFF',
    '2': '#FEF08A',
    '3': '#BFDBFE',
    '4': '#BBF7D0',
    '5': '#F6C9C4',
};

export const WORK_STORAGE_STATUS = [
    {
        label: 'Tất cả',
        value: 'all',
    },
    {
        label: 'Chưa nhận',
        value: 'changer_status',
    },
    {
        label: 'Đã giao',
        value: '1',
    },
    {
        label: 'Đang làm',
        value: '2',
    },
    {
        label: 'Đã xong',
        value: '3',
    },
    {
        label: 'Đã nghiệm thu',
        value: '4',
    },
    {
        label: 'Trễ',
        value: '5',
    },
];


export const LIST_CLASSIFY_CUSTOMER_STATUS_FILTER = [
    {
        value: 'all',
        label: 'Tất cả',
        color: '#FFFFFF'
    },
    {
        value: 'Tiềm năng',
        label: 'Tiềm năng',
        color: '#D4F3D5',
    },
    {
        value: 'Đang chăm sóc',
        label: 'Đang chăm sóc',
        color: '#F9F2CE',
    },
    {
        value: 'Đang hợp tác',
        label: 'Đang hợp tác',
        color: '#89B6FA',
    },
    {
        value: 'Đã chấm dứt',
        label: 'Đã chấm dứt',
        color: '#DC354591',
    }
]

export const LIST_PROCESS_CUSTOMER_STATUS_FILTER = [
    {
        value: 'all',
        label: 'Tất cả',
    },
    {
        value: 'Trinh sát',
        label: 'Trinh sát',
    },
    {
        value: 'Cơ hội',
        label: 'Cơ hội',
    },
    {
        value: 'Khách hàng',
        label: 'Khách hàng',
    },
    {
        value: 'Đơn hàng',
        label: 'Đơn hàng',
    },
    {
        value: 'Giao hàng',
        label: 'Giao hàng',
    },
    {
        value: 'CSKH',
        label: 'CSKH',
    }
]

export const LIST_CUSTOMER_TYPE_FILTER = [
    {
        value: 'all',
        label: 'Tất cả',
    },
    {
        value: 'Khách hàng lẻ',
        label: 'Khách hàng lẻ',
    },
    {
        value: 'Khách đại lý',
        label: 'Khách đại lý',
    },
    {
        label: 'Khách dự án',
        value: 'Khách dự án',
    },
    {
        label: 'Loại khác',
        value: 'Loại khác',
    }
]

export const WORK_STORAGE_STATUS_COLOR = {
    'all': '#FFF',
    'changer_status': '#FEF4A5',
    '1': '#F5F5F5',
    '2': '#FFB822',
    '3': '#89B6FA',
    '4': '#03D87F',
    '5': '#F5325C',
};

export const WORK_STATUS = {
    '1': 'Đã giao',
    '2': 'Đang làm',
    '3': 'Đã xong',
    '4': 'Đã nghiệm thu',
    '5': 'Trễ',
};

export const WORK_STATUS_OFFICE = {
    1: 'Đã giao',
    2: 'Đang làm',
    3: 'Đã xong',
    4: 'Trễ',
};

export const LIST_WORK_OFFICE_STATUS_FILTER = [
    {
        label: 'Tất cả trạng thái',
        value: '0',
    },
    {
        label: 'Đã giao',
        value: '1',
    },
    {
        label: 'Đang làm',
        value: '2',
    },
    {
        label: 'Đã xong',
        value: '3',
    },
    {
        label: 'Trễ',
        value: '4',
    },
];

export const LIST_WORK_STATUS_FILTER = [
    {
        label: 'Tất cả trạng thái',
        value: '0',
    },
    {
        label: 'Đã giao',
        value: '1',
    },
    {
        label: 'Đang làm',
        value: '2',
    },
    {
        label: 'Đã xong',
        value: '3',
    },
    {
        label: 'Đã nghiệm thu',
        value: '4',
    },
    {
        label: 'Trễ',
        value: '5',
    },
];

export const LIST_PROPOSE_STATUS_COLOR_DATA = {
    'all': '#FFF',
    'Converted': '#FFF',
    'Sent': '#F9F2CE',
    'CantSolve': '#D9D9D9',
    'FoundSolution': '#89B6FA',
    'Solved': '#D4F3D5',
};


export const LIST_PROPOSE_STATUS_COLOR = {
    '-1': '#FFF',
    '4': '#FFF',
    '0': '#F9F2CE',
    '3': '#D9D9D9',
    '1': '#89B6FA',
    '2': '#D4F3D5',
};

export const LIST_ABSENCE_TYPE = [
    {
        value: 0,
        label: 'Tất cả',
    },
    {
        value: 1,
        label: 'Nghỉ phép',
    },
    {
        value: 2,
        label: 'Nghỉ không lương',
    },
    {
        value: 3,
        label: 'Công tác',
    },
]

export const LIST_ABSENCE_TYPE_COLOR = [
    '#FFF',
    '#FBF2CA',
    '#CCF4D3',
    'rgba(124, 184, 255, 0.50)',
]

export const LIST_PROPOSE_STATUS = [
    {
        label: 'Tất cả',
        value: -1,
    },
    {
        label: 'Đã giao',
        value: 4,
    },
    {
        label: 'Đã tiếp nhận',
        value: 0,
    },
    {
        label: 'Đã có hướng giải quyết',
        value: 1,
    },
    {
        label: 'Đã giải quyết',
        value: 2,
    },
    {
        label: 'Không thể giải quyết',
        value: 3,
    },
];

export const LIST_REWARD_AND_PUNISHMENT_STATUS = [
    {
        label: 'Tất cả',
        value: 0,
    },
    {
        label: 'Đã tiếp nhận',
        value: 1,
    },
    {
        label: "Đã xử lý",
        value: 2,
    },
    {
        label: "Đang xử lý",
        value: 3,
    },
]

export const LIST_REWARD_AND_PUNISHMENT_STATUS_COLOR = [
    '#FFF',
    '#FFF',
    '#FBF2CA',
    '#97C8FF',
]

export const LIST_REWARD_AND_PUNISHMENT_UNIT = [
    {
        label: 'KPI',
        value: 1,
    },
    {
        label: 'Ngày Công',
        value: 2,
    },
    {
        label: 'Tiền',
        value: 3,
    }
]

export const LIST_REWARD_AND_PUNISHMENT_TYPE = [
    {
        value: 0,
        label: 'Tất cả',
    },
    {
        value: 1,
        label: 'Thưởng',
    },
    {
        value: 2,
        label: 'Phạt',
    },
    {
        value: 3,
        label: 'Nhắc nhở',
    },
    {
        value: 4,
        label: 'Sự cố',
    },
]

export const BANK_LIST = [
    {
        label: '(Ngân hàng Nông nghiệp và Phát triển Nông thôn) Agribank',
        value: '(Ngân hàng Nông nghiệp và Phát triển Nông thôn) Agribank',
    },
    {
        label: '(Ngân hàng Đầu tư và Phát triển Việt Nam) BIDV',
        value: '(Ngân hàng Đầu tư và Phát triển Việt Nam) BIDV',
    },
    {
        label: '(Ngân hàng Công thương Việt Nam) VietinBank',
        value: '(Ngân hàng Công thương Việt Nam) VietinBank',
    },
    {
        label: '(Ngân hàng Ngoại thương Việt Nam) Vietcombank',
        value: '(Ngân hàng Ngoại thương Việt Nam) Vietcombank',
    },
    {label: '(Ngân hàng Á Châu) ACB', value: '(Ngân hàng Á Châu) ACB'},
    {
        label: '(Ngân hàng Sài Gòn Thương Tín) Sacombank',
        value: '(Ngân hàng Sài Gòn Thương Tín) Sacombank',
    },
    {
        label: '(Ngân hàng Kỹ thương Việt Nam) Techcombank',
        value: '(Ngân hàng Kỹ thương Việt Nam) Techcombank',
    },
    {
        label: '(Ngân hàng Việt Nam Thịnh Vượng) VPBank',
        value: '(Ngân hàng Việt Nam Thịnh Vượng) VPBank',
    },
    {
        label: '(Ngân hàng Quân đội) MB Bank',
        value: '(Ngân hàng Quân đội) MB Bank',
    },
    {
        label: '(Ngân hàng Xuất nhập khẩu Việt Nam) Eximbank',
        value: '(Ngân hàng Xuất nhập khẩu Việt Nam) Eximbank',
    },
    {
        label: '(Ngân hàng Hàng Hải) Maritime Bank',
        value: '(Ngân hàng Hàng Hải) Maritime Bank',
    },
    {
        label: '(Ngân hàng Tiên Phong) TPBank',
        value: '(Ngân hàng Tiên Phong) TPBank',
    },
    {
        label: '(Ngân hàng Phương Đông) OCB',
        value: '(Ngân hàng Phương Đông) OCB',
    },
    {label: '(Ngân hàng Quốc tế) VIB', value: '(Ngân hàng Quốc tế) VIB'},
    {label: '(Ngân hàng Nam Á) NamABank', value: '(Ngân hàng Nam Á) NamABank'},
    {
        label: '(Ngân hàng Phát triển Thành phố Hồ Chí Minh) HDBank',
        value: '(Ngân hàng Phát triển Thành phố Hồ Chí Minh) HDBank',
    },
    {
        label: '(Ngân hàng Thương mại Cổ phần Sài Gòn - Hà Nội) SHB',
        value: '(Ngân hàng Thương mại Cổ phần Sài Gòn - Hà Nội) SHB',
    },
    {label: '(Ngân hàng Đông Á) SeABank', value: '(Ngân hàng Đông Á) SeABank'},
    {label: '(Ngân hàng An Bình) ABBank', value: '(Ngân hàng An Bình) ABBank'},
    {label: '(Ngân hàng Sài Gòn) SCB', value: '(Ngân hàng Sài Gòn) SCB'},
    {label: '(Ngân hàng Tiên Phong) TPB', value: '(Ngân hàng Tiên Phong) TPB'},
    {label: '(Ngân hàng Bắc Á) BacABank', value: '(Ngân hàng Bắc Á) BacABank'},
    {
        label: '(Ngân hàng Dầu khí Toàn cầu) GPBank',
        value: '(Ngân hàng Dầu khí Toàn cầu) GPBank',
    },
    {
        label: '(Ngân hàng Phương Đông) OCB',
        value: '(Ngân hàng Phương Đông) OCB',
    },
    {label: '(Ngân hàng Quốc dân) NCB', value: '(Ngân hàng Quốc dân) NCB'},
    {label: '(Ngân hàng Bảo Việt) BVB', value: '(Ngân hàng Bảo Việt) BVB'},
    {
        label: '(Ngân hàng Thương mại Cổ phần Việt Nam Cộng Thành) PVcomBank',
        value: '(Ngân hàng Thương mại Cổ phần Việt Nam Cộng Thành) PVcomBank',
    },
    {
        label: '(Ngân hàng Thương mại Cổ phần Sài Gòn - Hà Nội) SHB',
        value: '(Ngân hàng Thương mại Cổ phần Sài Gòn - Hà Nội) SHB',
    },
    {label: '(Ngân hàng Nam Á) NamABank', value: '(Ngân hàng Nam Á) NamABank'},
    {label: '(Ngân hàng An Bình) ABBank', value: '(Ngân hàng An Bình) ABBank'},
    {label: '(Ngân hàng Tiên Phong) TPB', value: '(Ngân hàng Tiên Phong) TPB'},
    {label: '(Ngân hàng Á Châu) ACB', value: '(Ngân hàng Á Châu) ACB'},
    {label: '(Ngân hàng Quốc tế) VIB', value: '(Ngân hàng Quốc tế) VIB'},
    {label: '(Ngân hàng Đông Á) SeABank', value: '(Ngân hàng Đông Á) SeABank'},
    {
        label: '(Ngân hàng Bảo Việt) BAOVIET Bank',
        value: '(Ngân hàng Bảo Việt) BAOVIET Bank',
    },
    {
        label: '(Ngân hàng Việt Nam Thịnh Vượng) VPBank',
        value: '(Ngân hàng Việt Nam Thịnh Vượng) VPBank',
    },
    {
        label: '(Ngân hàng Quân đội) MB Bank',
        value: '(Ngân hàng Quân đội) MB Bank',
    },
    {
        label: '(Ngân hàng Xuất nhập khẩu Việt Nam) Eximbank',
        value: '(Ngân hàng Xuất nhập khẩu Việt Nam) Eximbank',
    },
    {
        label: '(Ngân hàng Hàng Hải) Maritime Bank',
        value: '(Ngân hàng Hàng Hải) Maritime Bank',
    },
    {
        label: '(Ngân hàng Tiên Phong) TPBank',
        value: '(Ngân hàng Tiên Phong) TPBank',
    },
    {
        label: '(Ngân hàng Phương Đông) OCB',
        value: '(Ngân hàng Phương Đông) OCB',
    },
    {label: '(Ngân hàng Hàng Hải) MSB', value: '(Ngân hàng Hàng Hải) MSB'},
    {label: '(Ngân hàng Quốc dân) NCB', value: '(Ngân hàng Quốc dân) NCB'},
    {label: '(Ngân hàng Bảo Việt) BVB', value: '(Ngân hàng Bảo Việt) BVB'},
    {
        label: '(Ngân hàng TNHH Một thành viên Shinhan) Shinhan Bank Vietnam',
        value: '(Ngân hàng TNHH Một thành viên Shinhan) Shinhan Bank Vietnam',
    },
    {
        label: '(Ngân hàng TNHH Một thành viên Woori) Woori Bank Vietnam',
        value: '(Ngân hàng TNHH Một thành viên Woori) Woori Bank Vietnam',
    },
    {
        label: '(Ngân hàng TNHH Một thành viên KEB Hana) KEB Hana Bank',
        value: '(Ngân hàng TNHH Một thành viên KEB Hana) KEB Hana Bank',
    },
    {
        label: '(Công ty Tài chính TNHH Lotte) Lotte Finance Vietnam',
        value: '(Công ty Tài chính TNHH Lotte) Lotte Finance Vietnam',
    },
    {
        label: '(Công ty Tài chính TNHH Mirae Asset) Mirae Asset Finance Vietnam',
        value: '(Công ty Tài chính TNHH Mirae Asset) Mirae Asset Finance Vietnam',
    },
];

