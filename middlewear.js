module.exports.isLoggedIn= function(req,res,next){
    //if user is not authenticated 
    if(!req.isAuthenticated()){
        //store url in session
        req.session.returnTo = req.originalUrl
        //display flah error message
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}