import React, { Component } from "react";
import DataTable from './DataTable';

export default class ReactDataTableApp extends Component {


  render() {
    const columns = ['id', 'name', 'email', 'created_at'];
    return (
      <DataTable url="/api/user" columns={columns} />
    );
  }
}