const newman = require('newman'); // require newman in your project

class NewmanConfig{

    constructor(root_json_file){
        this.root_json = root_json_file
        this.looprun()
    }

    looprun(){
        var root_file = require(this.root_json)
        var run_list = root_file.runs
        console.log("!----------------------------------Files Taken to run---------------------------------------!")
        run_list.forEach(parseAndRun);

        function parseAndRun(value, index, array) {
            console.log(index)
            console.log(value)
            NewmanConfig.runCollection(value)
        }
        console.log("!-------------------------------------------------------------------------------------------!")
    }

    static reporters_list() {
        return ['cli', 'json', 'html', 'allure']
    }

    static allure_report_path() {
        return './reports/allure'
    }

    static newman_json_report_path() {
        return './reports/json/'
    }

    static newman_html_report_path() {
        return './reports/html/'
    }

    static createRunObject(inputValue){
        var file_name = inputValue.collection.split("/")
        var runObject = {
            collection: require(inputValue.collection),
            reporters: NewmanConfig.reporters_list(),
            reporter: {
                html: {
                    export: NewmanConfig.newman_html_report_path().concat(file_name[file_name.length - 1]).concat('.html') // If not specified, the file will be written to `newman/` in the current working directory.
                },
                allure: {
                    export: NewmanConfig.allure_report_path()
                },
                json: {
                    export: NewmanConfig.newman_json_report_path().concat(file_name[file_name.length - 1]).concat('.json')
                }
            }
        }
        // Add environment to the run object if it is defined in the "run" object in the feed file
        if (inputValue.environment != undefined){
            runObject.environment = require(inputValue.environment)
        }
        // Add iterationData to the run object if it is defined in the "run" object in the feed file
        if (inputValue.iterationData != undefined){
            runObject.iterationData = inputValue.iterationData
        }

        return runObject
    }

    static runCollection(inputValue){
        // call newman.run to pass `options` object and wait for callback
        var runObj = NewmanConfig.createRunObject(inputValue)
        newman.run(runObj, function (err) {
            if (err) { throw err; }
            console.log('Collection run complete!');
        });

    }

}

module.exports = NewmanConfig
