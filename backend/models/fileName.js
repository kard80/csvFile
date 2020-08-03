module.exports = (sequelize, DataTypes) => {
    const fileName = sequelize.define('fileName', {
        fileName: {
            type: DataTypes.STRING
        }
    })

    return fileName
}