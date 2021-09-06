//define a custom error class to throw an error when needed

class ExpressError extends Error{

    //constructor will get called automaticly when class is created
    constructor(message,statusCode){
        //super calls the parent constructor which is ERROR constructor in the case
        super();
        this.message = message;
        this.statusCode = statusCode;

        

    }


}

// EXPORT THE CLASS SO IT CAN BE USED IN OTHER FILES

module.exports = ExpressError