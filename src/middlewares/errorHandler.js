const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Servidor Error"})
}

export default errorHandler;