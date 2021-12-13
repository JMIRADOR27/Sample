import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from './Modal';

export default class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show:false,
      inputName: '',
      inputEmail: '',
      modification_id: '',
      entities: {
        data: [],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: 5,
          to: 1,
          total: 1,
        },
      },
      first_page: 1,
      current_page: 1,
      sorted_column: this.props.columns[0],
      offset: 4,
      order: 'desc',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.InputtedName = this.InputtedName.bind(this);
    this.InputtedEmail = this.InputtedEmail.bind(this);
    this.handlesubmitCreateForm = this.handlesubmitCreateForm.bind(this);
  }
  InputtedName(e) {
    this.setState({ inputName: e.target.value });
  }
  InputtedEmail(e){
    this.setState({ inputEmail: e.target.value });
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handlesubmitCreateForm(e) {
    e.preventDefault();
    let fetchUrl = `${this.props.url}/?name=${this.state.inputName}&email=${this.state.inputEmail}`;
    axios({method: 'POST',
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 30000,
    url: fetchUrl
   })
    .then(response => {
    if(response.data.status == 1){
        alert(response.data.message);
        window.location.reload();
    }else{
        alert(response.data.message);
    }

    })
    .catch(e => {
    console.error(e);
    });
  }

  fetchEntities() {
    let fetchUrl = `${this.props.url}/?page=${this.state.current_page}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.meta.per_page}`;
    axios({method: 'get',
            baseURL: 'http://127.0.0.1:8000/',
            timeout: 30000,
            url: fetchUrl
           })
      .then(response => {
          this.setState({ entities: response.data });
      })
      .catch(e => {
        console.error(e);
      });
  }

  changePage(pageNumber) {
    this.setState({ current_page: pageNumber }, () => {this.fetchEntities()});
  }

  columnHead(value) {
    return value.split('_').join(' ').toUpperCase()
  }

  pagesNumbers() {
    if (!this.state.entities.meta.to) {
      return [];
    }
    let from = this.state.entities.meta.current_page - this.state.offset;
    if (from < 1) {
      from = 1;
    }
    let to = from + (this.state.offset * 2);
    if (to >= this.state.entities.meta.last_page) {
      to = this.state.entities.meta.last_page;
    }
    let pagesArray = [];
    for (let page = from; page <= to; page++) {
      pagesArray.push(page);
    }
    return pagesArray;
  }

  componentDidMount() {
    this.setState({ current_page: this.state.entities.meta.current_page }, () => {this.fetchEntities()});
  }

  tableHeads() {
    let icon;
    if (this.state.order === 'asc') {
      icon = <i className="fas fa-arrow-up"></i>;
    } else {
      icon = <i className="fas fa-arrow-down"></i>;
    }
    return this.props.columns.map(column => {
      return <th className="table-head" key={column} onClick={() => this.sortByColumn(column)}>
        { this.columnHead(column) }
        { column === this.state.sorted_column && icon }
      </th>
    });
  }

  userList() {
    if (this.state.entities.data.length) {
      return this.state.entities.data.map(user => {
        return <tr key={ user.id }>
          {Object.keys(user).map(key => <td key={key}>{ user[key] }</td>)}
          <td><a href={'http://127.0.0.1:8000/api/user/' + user.id}>Delete</a></td>
        </tr>
      })
    } else {
      return <tr>
        <td colSpan={this.props.columns.length} className="text-center">No Records Found.</td>
      </tr>
    }
  }

  sortByColumn(column) {
    if (column === this.state.sorted_column) {
      this.state.order === 'asc' ? this.setState({ order: 'desc', current_page: this.state.first_page }, () => {this.fetchEntities()}) : this.setState({ order: 'asc' }, () => {this.fetchEntities()});
    } else {
      this.setState({ sorted_column: column, order: 'asc', current_page: this.state.first_page }, () => {this.fetchEntities()});
    }
  }

  pageList() {
    return this.pagesNumbers().map(page => {
      return <li className={ page === this.state.entities.meta.current_page ? 'page-item active' : 'page-item' } key={page}>
        <button className="page-link" onClick={() => this.changePage(page)}>{page}</button>
      </li>
    })
  }

  render() {
    return (
      <div className="container" style={{ marginTop: '10%' }}>
      <button className="btn-block btn-dark" onClick={this.showModal} style={{ marginBottom: '10px' }}>Create</button>
      <div className="data-table">
        <table className="table table-bordered">
          <thead>
            <tr>{ this.tableHeads() }</tr>
          </thead>
          <tbody>{ this.userList() }</tbody>
        </table>
        { (this.state.entities.data && this.state.entities.data.length > 0) &&
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link"
                  disabled={ 1 === this.state.entities.meta.current_page }
                  onClick={() => this.changePage(this.state.entities.meta.current_page - 1)}
                >
                  Previous
                </button>
              </li>
              { this.pageList() }
              <li className="page-item">
                <button className="page-link"
                  disabled={this.state.entities.meta.last_page === this.state.entities.meta.current_page}
                  onClick={() => this.changePage(this.state.entities.meta.current_page + 1)}
                >
                  Next
                </button>
              </li>
              <span style={{ marginTop: '8px' }}> &nbsp; <i>Displaying { this.state.entities.data.length } of { this.state.entities.meta.total } entries.</i></span>
            </ul>
          </nav>
        }
      </div>
      <Modal show={this.state.show} handleClose={this.hideModal} nameInput={this.InputtedName} emailInput={this.InputtedEmail} submitForm={this.handlesubmitCreateForm}></Modal>
      </div>
    );
  }
}