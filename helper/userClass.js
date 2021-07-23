module.exports.UserJson =  function (user, withToken=false) {
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
