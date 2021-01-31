module.exports = {
    // Format dates 
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
    },
    // Pluralize words when there are more than one
    format_plural: (word, amount) => {
        if (amount > 1) {
            return `${word}s`;
        }

        return word;
    }
}