(function(paginatedList) {

    var htmlNodes = {
        addEmployeesList: paginatedList.getHtmlNodes('add-employees'),
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        employeesList : paginatedList.getHtmlNodes('employees'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button'),
        viewWrapper : $('#view-wrapper')
    };

    var state = {
        employeesList: paginatedList.getState(),
        addEmployeesList: paginatedList.getState(),
        skill: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Employees: []
        },
        loading: true,
        readOnly: htmlNodes.readOnly.val() == 'true'
    };
    state.addEmployeesList.hasSearcher = true;
    state.addEmployeesList.searcherPlaceholder = "Add employees...";

    function render() {
        // State would be retrieved from the store in Redux        
        render.readOnly();
        render.skillName();
        render.skillEmployees();
        render.foundEmployees();
        render.viewWrapper();
    }

    render.foundEmployees = function () {
        paginatedList.render(htmlNodes.addEmployeesList, state.addEmployeesList, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><span class="add-employee" data-employee-id="' + employee.Id + '"><i class="fa fa-plus text-success"></i> '
                + employee.Name + '</span></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    render.skillName = function() {
        htmlNodes.pageTitle.html(state.skill.Name);
        htmlNodes.elementName.val(state.skill.Name);
    };

    render.skillEmployees = function() {
        paginatedList.render(htmlNodes.employeesList, state.employeesList, {
            elementDrawer: function (employee) {
                var html = '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
                if (!state.readOnly) {
                    html = '<li class="list-group-item"><span class="remove-employee" data-employee-id="' + employee.Id + '"><i class="fa fa-times text-danger"></i> '
                    + employee.Name + '</span></li>';
                }
                return html;
            },
            noResultsHtml: '<i>No employees assigned yet</i>'
        });
    };

    render.readOnly = function() {
        htmlNodes.addEmployeesList.wrapper.hide();
        htmlNodes.editButton.hide();
        htmlNodes.editButton.attr('href', '#');
        htmlNodes.deleteButton.hide();
        htmlNodes.pageTitle.text('Skill not found');            
        htmlNodes.saveButton.hide();
        htmlNodes.cancelButton.hide();
        htmlNodes.cancelButton.attr('href', '#');

        if (state.readOnly) {
            htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.skill.Id > 0) {
                htmlNodes.pageTitle.text(state.skill.Name);
                htmlNodes.editButton.attr('href', '/skills/edit?id=' + state.skill.Id);
                htmlNodes.editButton.show();
                htmlNodes.deleteButton.show();
            }
        }
        else {
            htmlNodes.elementName.removeAttr('disabled');                
            if (state.skill.Id >= 0) {
                htmlNodes.pageTitle.text('New skill');
                htmlNodes.addEmployeesList.wrapper.show();
                htmlNodes.saveButton.show();
                htmlNodes.cancelButton.show();
                htmlNodes.cancelButton.attr('href', '/skills/');

                if (state.skill.Id > 0) {
                    htmlNodes.pageTitle.text(state.skill.Name);
                    htmlNodes.cancelButton.attr('href', '/skills/details?id=' + state.skill.Id);
                }
            }
        }
    };

    render.viewWrapper = function() {
        if (state.loading) {
            htmlNodes.viewWrapper.css({
                visibility: 'hidden'
            });
            htmlNodes.loader.parent().removeClass('loaded').addClass('loading');
        }
        else {
            htmlNodes.viewWrapper.css({
                visibility: 'visible'
            });
            htmlNodes.loader.parent().removeClass('loading').addClass('loaded');
        }
    };

    window.application = window.application || {};
    window.application.skillDetails = window.application.skillDetails || {};
    window.application.skillDetails.htmlNodes = htmlNodes;
    window.application.skillDetails.state = state;
    window.application.skillDetails.render = render;

})(window.PaginatedList);
