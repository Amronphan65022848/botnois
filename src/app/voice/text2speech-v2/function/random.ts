export const generateID = () => {

    let result_id = "";
    const length = 5;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
        result_id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result_id;
}
