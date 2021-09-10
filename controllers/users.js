const User = require("../models/user");


module.exports.renderRegister = function(req,res){
    //render HTML page NOTE users refers to the folder inside the views
    res.render("users/register")
}

module.exports.registerUser = async function(req,res,next){
    try{
        //destructer req.body 
        const {email,username,password} =req.body
        //make  user model instance
        const user = User({email, username});
        //call register
        //Convenience method to register a new user instance with a given password. Checks if username is unique.
        const registeredUser = await User.register(user,password);
        //log user in
        req.login(registeredUser,err=>{
            if(err)return next(err)
            //dispy success flash message to userof the app(website)
            req.flash("success","welcome to Yelpcamp");
            //redirecting backto camgrounds
            res.redirect("/campgrounds");

        })
        console.log(registeredUser);
        
      
    }
    catch(e){
         //dispy error flash message to userof the app(website)
        req.flash("error",e.message);
        //redirect to regiter(stay on the same page)
        res.redirect("/register")

    }

}

module.exports.renderLogin = function(req,res){
    res.render("users/login")

}

module.exports.login = function(req,res){

    //dispy success flash message to userof the app(website)
    req.flash("success","welcome back");

    const redirectUrl = req.session.returnTo || '/campgrounds';
    //redirecting backto camgrounds
  
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    
}

module.exports.logout = function (req,res){

    req.logout();
    req.flash("success","Goodbye");
    res.redirect("/campgrounds");

}