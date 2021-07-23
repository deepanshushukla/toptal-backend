const UserJson =  function(user, withToken=false) {
    console.log(user, "userDeta");
    this.id = user._id
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.role = user.role;
    if( withToken ){
        this.accessToken = user.accessToken
    }
}; 

module.exports.ApartmentJson =  function (apartment) {
    this.apartmentName = apartment.apartmentName;
    this.description = apartment.description;
    this.floorAreaSize = apartment.floorAreaSize;
    this.pricePerMonth = apartment.pricePerMonth;
    this.numberOfRooms = apartment.numberOfRooms;
    this.geolocation = apartment.geolocation;
    this.createdAt = apartment.createdAt;
    this.owner = new UserJson(apartment.owner);
    this.isSold = apartment.isSold;
};

module.exports.UserJson =  UserJson;