const stringifyDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric'};
    const newDate = !date ? "undefined" :
                    new Date(Date.parse(date)).toLocaleDateString('en-GB',options);
    return newDate;
} 

const checkName = (name) => {
    let nameRegex = RegExp('^[A-Z]{1}[a-z]{2,}([\\s][A-Z]{1}[a-z]{2,})?$');
    if (!nameRegex.test(name)) throw "Name is Incorrect!";
}

const checkStartDate = (startDate) => {
    let now = new Date();
    if (startDate > now) throw "Start Date Cannot Be A Future Date!";
    var difference = Math.abs(now.getTime() - startDate.getTime());
    if (difference / (1000 * 60 * 60 * 24) > 30)
    throw 'Start Date is beyond 30 Days!';
}