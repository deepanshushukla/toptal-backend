const Apartment = require('../models/apartment');
const userClass =  require('../helper/userClass');
const ApartmentJson = userClass.ApartmentJson;

exports.createApartmentDetails = async (req, res, next) => {
    try {
        const { apartmentName, apartmentDescription, floorAreaSize, 
            pricePerMonth, numberOfRooms, geoLocation } = req.body;
            
        const owner = res.locals.loggedInUser;
        const newApartment = new Apartment({ apartmentName, apartmentDescription, floorAreaSize, 
            pricePerMonth, numberOfRooms, geoLocation, owner});
        await newApartment.save();
        res.json({data: new ApartmentJson(newApartment)});
    } catch (error) {
        next(error)
    }
};

exports.getApartmentDetails = async (req, res, next) => {
    try {
        const filter = req.user.role === "client" ? {isSold:false} : {};
        const apartments = await Apartment.find(filter);
        res.status(200).json({
            data: apartments.filter((apartment)=>{
                if(apartment.owner) {
                    return new ApartmentJson(apartment);
                } 
            })
        });
    } catch (e){
        next(e)
    }
}