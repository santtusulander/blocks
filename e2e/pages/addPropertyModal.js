module.exports = {
  elements: {
    modalHeader: {
      selector: '.configuration-sidebar .modal-header h1'
    },
    modalTitle: {
      selector: '.configuration-sidebar .modal-header p'
    },
    hostname: {
      selector: '#new_host_name'
    },
    trial: {
      selector: '.configuration-sidebar form .form-group:nth-of-type(2) label'
    },
    production: {
      selector: '.configuration-sidebar form .form-group:nth-of-type(3) label'
    },
    cancel: {
      selector: '.configuration-sidebar .btn-toolbar button:first-of-type'
    },
    save: {
      selector: '.configuration-sidebar .btn-toolbar button:last-of-type'
    }
  }
};
