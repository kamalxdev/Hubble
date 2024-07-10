


export default function generateSocketID() {

    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?/><-_+!~|';
    const randomString = Array.from({ length: 23 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    return randomString;
};