 function UserJson (user, withToken=false) {
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

function ApartmentJson (apartment) {
    this.apartmentName = apartment.apartmentName;
    this.id = apartment._id || null;
    this.apartmentDescription = apartment.apartmentDescription;
    this.floorAreaSize = apartment.floorAreaSize;
    this.pricePerMonth = apartment.pricePerMonth;
    this.numberOfRooms = apartment.numberOfRooms;
    this.geoLocation = apartment.geoLocation;
    this.createdAt = apartment.createdAt;
    if(apartment.owner){
        this.owner = new UserJson(apartment.owner);
    }
    this.isRented = apartment.isRented;
};

module.exports =  {ApartmentJson,UserJson}
