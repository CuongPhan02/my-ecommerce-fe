export interface Province {
  name: string;
  districts: string[];
}

export const VIETNAM_PROVINCES: Province[] = [
  {
    name: "Hồ Chí Minh",
    districts: [
      "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
      "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú",
      "Thành phố Thủ Đức", "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè"
    ]
  },
  {
    name: "Hà Nội",
    districts: [
      "Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ", "Quận Long Biên", "Quận Cầu Giấy", "Quận Đống Đa",
      "Quận Hai Bà Trưng", "Quận Hoàng Mai", "Quận Thanh Xuân", "Huyện Sóc Sơn", "Huyện Đông Anh", "Huyện Gia Lâm",
      "Quận Nam Từ Liêm", "Huyện Thanh Trì", "Quận Bắc Từ Liêm", "Huyện Mê Linh", "Quận Hà Đông", "Thị xã Sơn Tây",
      "Huyện Ba Vì", "Huyện Phúc Thọ", "Huyện Đan Phượng", "Huyện Hoài Đức", "Huyện Quốc Oai", "Huyện Thạch Thất",
      "Huyện Chương Mỹ", "Huyện Thanh Oai", "Huyện Thường Tín", "Huyện Phú Xuyên", "Huyện Ứng Hòa", "Huyện Mỹ Đức"
    ]
  },
  {
    name: "Đà Nẵng",
    districts: ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang"]
  },
  {
    name: "Bình Dương",
    districts: ["Thành phố Thủ Dầu Một", "Thành phố Thuận An", "Thành phố Dĩ An", "Thành phố Tân Uyên", "Thành phố Bến Cát", "Huyện Bàu Bàng", "Huyện Dầu Tiếng", "Huyện Phú Giáo", "Huyện Bắc Tân Uyên"]
  },
  {
    name: "Đồng Nai",
    districts: ["Thành phố Biên Hòa", "Thành phố Long Khánh", "Huyện Long Thành", "Huyện Nhơn Trạch", "Huyện Vĩnh Cửu", "Huyện Trảng Bom", "Huyện Thống Nhất", "Huyện Định Quán", "Huyện Tân Phú", "Huyện Cẩm Mỹ", "Huyện Xuân Lộc"]
  },
  {
    name: "Khánh Hòa",
    districts: ["Thành phố Nha Trang", "Thành phố Cam Ranh", "Thị xã Ninh Hòa", "Huyện Vạn Ninh", "Huyện Diên Khánh", "Huyện Khánh Vĩnh", "Huyện Khánh Sơn", "Huyện Cam Lâm", "Huyện Trường Sa"]
  },
  {
    name: "Hải Phòng",
    districts: ["Quận Hồng Bàng", "Quận Ngô Quyền", "Quận Lê Chân", "Quận Hải An", "Quận Kiến An", "Quận Đồ Sơn", "Quận Dương Kinh", "Huyện Thủy Nguyên", "Huyện An Dương", "Huyện An Lão", "Huyện Kiến Thụy", "Huyện Tiên Lãng", "Huyện Vĩnh Bảo", "Huyện Cát Hải", "Huyện Bạch Long Vĩ"]
  },
  {
    name: "Cần Thơ",
    districts: ["Quận Ninh Kiều", "Quận Bình Thủy", "Quận Cái Răng", "Quận Ô Môn", "Quận Thốt Nốt", "Huyện Phong Điền", "Huyện Cờ Đỏ", "Huyện Vĩnh Thạnh", "Huyện Thới Lai"]
  },
  {
    name: "Bà Rịa - Vũng Tàu",
    districts: ["Thành phố Vũng Tàu", "Thành phố Bà Rịa", "Thị xã Phú Mỹ", "Huyện Châu Đức", "Huyện Đất Đỏ", "Huyện Long Điền", "Huyện Xuyên Mộc", "Huyện Côn Đảo"]
  },
  {
    name: "Lâm Đồng",
    districts: ["Thành phố Đà Lạt", "Thành phố Bảo Lộc", "Huyện Lạc Dương", "Huyện Đơn Dương", "Huyện Đức Trọng", "Huyện Lâm Hà", "Huyện Di Linh", "Huyện Bảo Lâm", "Huyện Đạ Huoai", "Huyện Đạ Tẻh", "Huyện Cát Tiên", "Huyện Đam Rông"]
  },
  {
    name: "Thừa Thiên Huế",
    districts: ["Thành phố Huế", "Thị xã Hương Thủy", "Thị xã Hương Trà", "Huyện Phong Điền", "Huyện Quảng Điền", "Huyện Phú Vang", "Huyện Phú Lộc", "Huyện A Lưới", "Huyện Nam Đông"]
  },
  {
    name: "Quảng Ninh",
    districts: ["Thành phố Hạ Long", "Thành phố Móng Cái", "Thành phố Cẩm Phả", "Thành phố Uông Bí", "Thành phố Đông Triều", "Thị xã Quảng Yên", "Huyện Vân Đồn", "Huyện Tiên Yên", "Huyện Hải Hà", "Huyện Đầm Hà", "Huyện Bình Liêu", "Huyện Ba Chẽ", "Huyện Cô Tô"]
  },
  {
    name: "Thanh Hóa",
    districts: ["Thành phố Thanh Hóa", "Thành phố Sầm Sơn", "Thị xã Bỉm Sơn", "Thị xã Nghi Sơn", "Huyện Đông Sơn", "Huyện Quảng Xương", "Huyện Hoằng Hóa", "Huyện Hậu Lộc", "Huyện Hà Trung", "Huyện Nga Sơn", "Huyện Thiệu Hóa", "Huyện Triệu Sơn", "Huyện Yên Định", "Huyện Vĩnh Lộc", "Huyện Thọ Xuân", "Huyện Nông Cống", "Huyện Như Thanh", "Huyện Như Xuân", "Huyện Thường Xuân", "Huyện Lang Chánh", "Huyện Ngọc Lặc", "Huyện Bá Thước", "Huyện Quan Hóa", "Huyện Quan Sơn", "Huyện Mường Lát", "Huyện Thạch Thành"]
  },
  {
    name: "Nghệ An",
    districts: ["Thành phố Vinh", "Thị xã Cửa Lò", "Thị xã Thái Hòa", "Thị xã Hoàng Mai", "Huyện Quỳnh Lưu", "Huyện Diễn Châu", "Huyện Nghi Lộc", "Huyện Yên Thành", "Huyện Hưng Nguyên", "Huyện Nam Đàn", "Huyện Thanh Chương", "Huyện Đô Lương", "Huyện Tân Kỳ", "Huyện Anh Sơn", "Huyện Con Cuông", "Huyện Tương Dương", "Huyện Kỳ Sơn", "Huyện Quỳ Hợp", "Huyện Quỳ Châu", "Huyện Quế Phong", "Huyện Nghĩa Đàn"]
  },
  {
    name: "Kiên Giang",
    districts: ["Thành phố Rạch Giá", "Thành phố Hà Tiên", "Thành phố Phú Quốc", "Huyện Kiên Lương", "Huyện Hòn Đất", "Huyện Tân Hiệp", "Huyện Châu Thành", "Huyện Giồng Riềng", "Huyện Gò Quao", "Huyện An Biên", "Huyện An Minh", "Huyện Vĩnh Thuận", "Huyện Phú Quốc", "Huyện Kiên Hải", "Huyện U Minh Thượng", "Huyện Giang Thành"]
  },
  {
    name: "An Giang",
    districts: ["Thành phố Long Xuyên", "Thành phố Châu Đốc", "Thị xã Tân Châu", "Thị xã Tịnh Biên", "Huyện An Phú", "Huyện Châu Phú", "Huyện Phú Tân", "Huyện Chợ Mới", "Huyện Thoại Sơn", "Huyện Tri Tôn", "Huyện Châu Thành"]
  },
  {
    name: "Bắc Ninh",
    districts: ["Thành phố Bắc Ninh", "Thành phố Từ Sơn", "Thị xã Thuận Thành", "Thị xã Quế Võ", "Huyện Yên Phong", "Huyện Tiên Du", "Huyện Gia Bình", "Huyện Lương Tài"]
  },
  {
    name: "Bắc Giang",
    districts: ["Thành phố Bắc Giang", "Thị xã Việt Yên", "Huyện Yên Dũng", "Huyện Lạng Giang", "Huyện Lục Nam", "Huyện Lục Ngạn", "Huyện Sơn Động", "Huyện Yên Thế", "Huyện Tân Yên", "Huyện Hiệp Hòa"]
  },
  {
    name: "Bình Thuận",
    districts: ["Thành phố Phan Thiết", "Thị xã La Gi", "Huyện Tuy Phong", "Huyện Bắc Bình", "Huyện Hàm Thuận Bắc", "Huyện Hàm Thuận Nam", "Huyện Tánh Linh", "Huyện Đức Linh", "Huyện Hàm Tân", "Huyện Phú Quý"]
  },
  {
    name: "Bình Định",
    districts: ["Thành phố Quy Nhơn", "Thị xã An Nhơn", "Thị xã Hoài Nhơn", "Huyện An Lão", "Huyện Hoài Ân", "Huyện Phù Mỹ", "Huyện Phù Cát", "Huyện Tây Sơn", "Huyện Vân Canh", "Huyện Tuy Phước", "Huyện Vĩnh Thạnh"]
  },
  {
    name: "Bến Tre",
    districts: ["Thành phố Bến Tre", "Huyện Châu Thành", "Huyện Chợ Lách", "Huyện Mỏ Cày Nam", "Huyện Mỏ Cày Bắc", "Huyện Giồng Trôm", "Huyện Bình Đại", "Huyện Ba Tri", "Huyện Thạnh Phú"]
  },
  {
    name: "Bình Phước",
    districts: ["Thành phố Đồng Xoài", "Thị xã Phước Long", "Thị xã Bình Long", "Huyện Đồng Phú", "Huyện Chơn Thành", "Huyện Hớn Quản", "Huyện Lộc Ninh", "Huyện Bù Đốp", "Huyện Bù Gia Mập", "Huyện Bù Đăng", "Huyện Phú Riềng"]
  },
  {
    name: "Bạc Liêu",
    districts: ["Thành phố Bạc Liêu", "Thị xã Giá Rai", "Huyện Hồng Dân", "Huyện Phước Long", "Huyện Vĩnh Lợi", "Huyện Đông Hải", "Huyện Hòa Bình"]
  },
  {
    name: "Bắc Kạn",
    districts: ["Thành phố Bắc Kạn", "Huyện Pác Nặm", "Huyện Ba Bể", "Huyện Ngân Sơn", "Huyện Bạch Thông", "Huyện Chợ Đồn", "Huyện Chợ Mới", "Huyện Na Rì"]
  },
  {
    name: "Cà Mau",
    districts: ["Thành phố Cà Mau", "Huyện Đầm Dơi", "Huyện Ngọc Hiển", "Huyện Năm Căn", "Huyện Cái Nước", "Huyện Phú Tân", "Huyện Trần Văn Thời", "Huyện U Minh", "Huyện Thới Bình"]
  },
  {
    name: "Cao Bằng",
    districts: ["Thành phố Cao Bằng", "Huyện Bảo Lâm", "Huyện Bảo Lạc", "Huyện Hà Quảng", "Huyện Trùng Khánh", "Huyện Hạ Lang", "Huyện Quảng Hòa", "Huyện Hòa An", "Huyện Nguyên Bình", "Huyện Thạch An"]
  },
  {
    name: "Đắk Lắk",
    districts: ["Thành phố Buôn Ma Thuột", "Thị xã Buôn Hồ", "Huyện Ea H'leo", "Huyện Krông Búk", "Huyện Krông Năng", "Huyện Ea Súp", "Huyện Buôn Đôn", "Huyện Cư M'gar", "Huyện Krông Pắc", "Huyện Krông Bông", "Huyện Krông Ana", "Huyện Lắk", "Huyện M'Drắk", "Huyện Krông Năng", "Huyện Ea Kar"]
  },
  {
    name: "Đắk Nông",
    districts: ["Thành phố Gia Nghĩa", "Huyện Đăk Glong", "Huyện Cư Jút", "Huyện Đắk Mil", "Huyện Krông Nô", "Huyện Đắk Song", "Huyện Đắk R'Lấp", "Huyện Tuy Đức"]
  },
  {
    name: "Điện Biên",
    districts: ["Thành phố Điện Biên Phủ", "Thị xã Mường Lay", "Huyện Điện Biên", "Huyện Điện Biên Đông", "Huyện Mường Ảng", "Huyện Mường Chà", "Huyện Tủa Chùa", "Huyện Tuần Giáo", "Huyện Nậm Pồ", "Huyện Mường Nhé"]
  },
  {
    name: "Đồng Tháp",
    districts: ["Thành phố Cao Lãnh", "Thành phố Sa Đéc", "Thành phố Hồng Ngự", "Huyện Tân Hồng", "Huyện Hồng Ngự", "Huyện Tam Nông", "Huyện Tháp Mười", "Huyện Cao Lãnh", "Huyện Thanh Bình", "Huyện Lấp Vò", "Huyện Lai Vung", "Huyện Châu Thành"]
  },
  {
    name: "Gia Lai",
    districts: ["Thành phố Pleiku", "Thị xã An Khê", "Thị xã Ayun Pa", "Huyện Chư Păh", "Huyện Chư Prông", "Huyện Chư Sê", "Huyện Đức Cơ", "Huyện Ia Grai", "Huyện KBang", "Huyện Krông Chro", "Huyện Kông Chro", "Huyện Mang Yang", "Huyện Phú Thiện", "Huyện Chư Pưh", "Huyện Ia Pa", "Huyện Đak Đoa", "Huyện Đak Pơ"]
  },
  {
    name: "Hà Giang",
    districts: ["Thành phố Hà Giang", "Huyện Đồng Văn", "Huyện Mèo Vạc", "Huyện Yên Minh", "Huyện Quản Bạ", "Huyện Vị Xuyên", "Huyện Bắc Mê", "Huyện Hoàng Su Phì", "Huyện Xín Mần", "Huyện Bắc Quang", "Huyện Quang Bình"]
  },
  {
    name: "Hà Nam",
    districts: ["Thành phố Phủ Lý", "Thị xã Duy Tiên", "Thị xã Kim Bảng", "Huyện Thanh Liêm", "Huyện Bình Lục", "Huyện Lý Nhân"]
  },
  {
    name: "Hà Tĩnh",
    districts: ["Thành phố Hà Tĩnh", "Thị xã Hồng Lĩnh", "Thị xã Kỳ Anh", "Huyện Hương Sơn", "Huyện Đức Thọ", "Huyện Nghi Xuân", "Huyện Can Lộc", "Huyện Hương Khê", "Huyện Thạch Hà", "Huyện Cẩm Xuyên", "Huyện Kỳ Anh", "Huyện Vũ Quang", "Huyện Lộc Hà"]
  },
  {
    name: "Hải Dương",
    districts: ["Thành phố Hải Dương", "Thành phố Chí Linh", "Thị xã Kinh Môn", "Huyện Bình Giang", "Huyện Cẩm Giàng", "Huyện Gia Lộc", "Huyện Kim Thành", "Huyện Nam Sách", "Huyện Ninh Giang", "Huyện Thanh Hà", "Huyện Thanh Miện", "Huyện Tứ Kỳ"]
  },
  {
    name: "Hậu Giang",
    districts: ["Thành phố Vị Thanh", "Thành phố Ngã Bảy", "Thị xã Long Mỹ", "Huyện Vị Thủy", "Huyện Long Mỹ", "Huyện Phụng Hiệp", "Huyện Châu Thành", "Huyện Châu Thành A"]
  },
  {
    name: "Hòa Bình",
    districts: ["Thành phố Hòa Bình", "Huyện Đà Bắc", "Huyện Lương Sơn", "Huyện Kim Bôi", "Huyện Cao Phong", "Huyện Tân Lạc", "Huyện Mai Châu", "Huyện Lạc Sơn", "Huyện Yên Thủy", "Huyện Lạc Thủy"]
  },
  {
    name: "Hưng Yên",
    districts: ["Thành phố Hưng Yên", "Thị xã Mỹ Hào", "Huyện Văn Lâm", "Huyện Văn Giang", "Huyện Yên Mỹ", "Huyện Khoái Châu", "Huyện Kim Động", "Huyện Ân Thi", "Huyện Tiên Lữ", "Huyện Phù Cừ"]
  },
  {
    name: "Kon Tum",
    districts: ["Thành phố Kon Tum", "Huyện Đắk Glei", "Huyện Ngọc Hồi", "Huyện Đắk Tô", "Huyện Sa Thầy", "Huyện Kon Plông", "Huyện Kon Rẫy", "Huyện Đắk Hà", "Huyện Tu Mơ Rông", "Huyện Ia H'Drai"]
  },
  {
    name: "Lai Châu",
    districts: ["Thành phố Lai Châu", "Huyện Tam Đường", "Huyện Phong Thổ", "Huyện Sìn Hồ", "Huyện Mường Tè", "Huyện Than Uyên", "Huyện Tân Uyên", "Huyện Nậm Nhùn"]
  },
  {
    name: "Lạng Sơn",
    districts: ["Thành phố Lạng Sơn", "Huyện Tràng Định", "Huyện Bình Gia", "Huyện Văn Lãng", "Huyện Bắc Sơn", "Huyện Văn Quan", "Huyện Cao Lộc", "Huyện Lộc Bình", "Huyện Chi Lăng", "Huyện Đình Lập", "Huyện Hữu Lũng"]
  },
  {
    name: "Lào Cai",
    districts: ["Thành phố Lào Cai", "Thị xã Sa Pa", "Huyện Bát Xát", "Huyện Mường Khương", "Huyện Si Ma Cai", "Huyện Bắc Hà", "Huyện Bảo Thắng", "Huyện Bảo Yên", "Huyện Văn Bàn"]
  },
  {
    name: "Long An",
    districts: ["Thành phố Tân An", "Thị xã Kiến Tường", "Huyện Tân Hưng", "Huyện Vĩnh Hưng", "Huyện Mộc Hóa", "Huyện Tân Thạnh", "Huyện Thạnh Hóa", "Huyện Đức Huệ", "Huyện Đức Hòa", "Huyện Bến Lức", "Huyện Thủ Thừa", "Huyện Châu Thành", "Huyện Tân Trụ", "Huyện Cần Đước", "Huyện Cần Giuộc"]
  },
  {
    name: "Nam Định",
    districts: ["Thành phố Nam Định", "Huyện Mỹ Lộc", "Huyện Vụ Bản", "Huyện Ý Yên", "Huyện Nghĩa Hưng", "Huyện Nam Trực", "Huyện Trực Ninh", "Huyện Xuân Trường", "Huyện Giao Thủy", "Huyện Hải Hậu"]
  },
  {
    name: "Ninh Bình",
    districts: ["Thành phố Ninh Bình", "Thành phố Tam Điệp", "Huyện Nho Quan", "Huyện Gia Viễn", "Huyện Hoa Lư", "Huyện Yên Khánh", "Huyện Kim Sơn", "Huyện Yên Mô"]
  },
  {
    name: "Ninh Thuận",
    districts: ["Thành phố Phan Rang - Tháp Chàm", "Huyện Bác Ái", "Huyện Ninh Sơn", "Huyện Ninh Hải", "Huyện Ninh Phước", "Huyện Thuận Bắc", "Huyện Thuận Nam"]
  },
  {
    name: "Phú Thọ",
    districts: ["Thành phố Việt Trì", "Thị xã Phú Thọ", "Huyện Đoan Hùng", "Huyện Hạ Hòa", "Huyện Thanh Ba", "Huyện Phù Ninh", "Huyện Yên Lập", "Huyện Cẩm Khê", "Huyện Tam Nông", "Huyện Thanh Sơn", "Huyện Thanh Thủy", "Huyện Tân Sơn", "Huyện Lâm Thao"]
  },
  {
    name: "Phú Yên",
    districts: ["Thành phố Tuy Hòa", "Thị xã Sông Cầu", "Thị xã Đông Hòa", "Huyện Đồng Xuân", "Huyện Tuy An", "Huyện Sơn Hòa", "Huyện Sông Hinh", "Huyện Tây Hòa", "Huyện Phú Hòa"]
  },
  {
    name: "Quảng Bình",
    districts: ["Thành phố Đồng Hới", "Thị xã Ba Đồn", "Huyện Minh Hóa", "Huyện Tuyên Hóa", "Huyện Quảng Trạch", "Huyện Bố Trạch", "Huyện Quảng Ninh", "Huyện Lệ Thủy"]
  },
  {
    name: "Quảng Nam",
    districts: ["Thành phố Tam Kỳ", "Thành phố Hội An", "Thị xã Điện Bàn", "Huyện Tây Giang", "Huyện Đông Giang", "Huyện Nam Giang", "Huyện Phước Sơn", "Huyện Bắc Trà My", "Huyện Nam Trà My", "Huyện Hiệp Đức", "Huyện Tiên Phước", "Huyện Bắc Trà My", "Huyện Nông Sơn", "Huyện Duy Xuyên", "Huyện Đại Lộc", "Huyện Thăng Bình", "Huyện Phú Ninh", "Huyện Núi Thành"]
  },
  {
    name: "Quảng Ngãi",
    districts: ["Thành phố Quảng Ngãi", "Thị xã Đức Phổ", "Huyện Bình Sơn", "Huyện Trà Bồng", "Huyện Tây Trà", "Huyện Sơn Tịnh", "Huyện Tư Nghĩa", "Huyện Nghĩa Hành", "Huyện Mộ Đức", "Huyện Đức Phổ", "Huyện Ba Tơ", "Huyện Minh Long", "Huyện Sơn Hà", "Huyện Sơn Tây", "Huyện Lý Sơn"]
  },
  {
    name: "Quảng Trị",
    districts: ["Thành phố Đông Hà", "Thị xã Quảng Trị", "Huyện Vĩnh Linh", "Huyện Hướng Hóa", "Huyện Gio Linh", "Huyện Đakrông", "Huyện Cam Lộ", "Huyện Triệu Phong", "Huyện Hải Lăng", "Huyện Cồn Cỏ"]
  },
  {
    name: "Sóc Trăng",
    districts: ["Thành phố Sóc Trăng", "Thị xã Vĩnh Châu", "Thị xã Ngã Năm", "Huyện Châu Thành", "Huyện Kế Sách", "Huyện Mỹ Tú", "Huyện Cù Lao Dung", "Huyện Long Phú", "Huyện Mỹ Xuyên", "Huyện Thạnh Trị", "Huyện Trần Đề"]
  },
  {
    name: "Sơn La",
    districts: ["Thành phố Sơn La", "Huyện Quỳnh Nhai", "Huyện Thuận Châu", "Huyện Mường La", "Huyện Bắc Yên", "Huyện Phù Yên", "Huyện Mộc Châu", "Huyện Yên Châu", "Huyện Mai Sơn", "Huyện Sông Mã", "Huyện Sốp Cộp", "Huyện Vân Hồ"]
  },
  {
    name: "Tây Ninh",
    districts: ["Thành phố Tây Ninh", "Thị xã Hòa Thành", "Thị xã Trảng Bàng", "Huyện Tân Biên", "Huyện Tân Châu", "Huyện Dương Minh Châu", "Huyện Châu Thành", "Huyện Bến Cầu", "Huyện Gò Dầu"]
  },
  {
    name: "Thái Bình",
    districts: ["Thành phố Thái Bình", "Huyện Quỳnh Phụ", "Huyện Hưng Hà", "Huyện Đông Hưng", "Huyện Thái Thụy", "Huyện Tiền Hải", "Huyện Kiến Xương", "Huyện Vũ Thư"]
  },
  {
    name: "Thái Nguyên",
    districts: ["Thành phố Thái Nguyên", "Thành phố Sông Công", "Thành phố Phổ Yên", "Huyện Định Hóa", "Huyện Phú Lương", "Huyện Đồng Hỷ", "Huyện Võ Nhai", "Huyện Đại Từ", "Huyện Phú Bình"]
  },
  {
    name: "Tiền Giang",
    districts: ["Thành phố Mỹ Tho", "Thị xã Gò Công", "Thị xã Cai Lậy", "Huyện Tân Phước", "Huyện Cái Bè", "Huyện Cai Lậy", "Huyện Châu Thành", "Huyện Chợ Gạo", "Huyện Gò Công Tây", "Huyện Gò Công Đông", "Huyện Tân Phú Đông"]
  },
  {
    name: "Trà Vinh",
    districts: ["Thành phố Trà Vinh", "Thị xã Duyên Hải", "Huyện Càng Long", "Huyện Cầu Kè", "Huyện Tiểu Cần", "Huyện Châu Thành", "Huyện Trà Cú", "Huyện Cầu Ngang", "Huyện Duyên Hải"]
  },
  {
    name: "Tuyên Quang",
    districts: ["Thành phố Tuyên Quang", "Huyện Lâm Bình", "Huyện Na Hang", "Huyện Chiêm Hóa", "Huyện Hàm Yên", "Huyện Yên Sơn", "Huyện Sơn Dương"]
  },
  {
    name: "Vĩnh Long",
    districts: ["Thành phố Vĩnh Long", "Thị xã Bình Minh", "Huyện Long Hồ", "Huyện Mang Thít", "Huyện Vũng Liêm", "Huyện Tam Bình", "Huyện Trà Ôn", "Huyện Bình Tân"]
  },
  {
    name: "Vĩnh Phúc",
    districts: ["Thành phố Vĩnh Yên", "Thành phố Phúc Yên", "Huyện Lập Thạch", "Huyện Sông Lô", "Huyện Tam Dương", "Huyện Bình Xuyên", "Huyện Tam Đảo", "Huyện Yên Lạc", "Huyện Vĩnh Tường"]
  },
  {
    name: "Yên Bái",
    districts: ["Thành phố Yên Bái", "Thị xã Nghĩa Lộ", "Huyện Lục Yên", "Huyện Văn Yên", "Huyện Mù Căng Chải", "Huyện Trấn Yên", "Huyện Trạm Tấu", "Huyện Văn Chấn", "Huyện Yên Bình"]
  }
];
