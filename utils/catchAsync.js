// this fuction takes in a function as a argument and if any thing goes wrong it catches the error
function catchAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err =>next(err))
    }
}

module.exports = catchAsync