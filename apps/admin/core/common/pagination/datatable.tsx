/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table } from "antd";

type DatatableProps = {
  columns: any[];
  dataSource: any[];
  rowKey?: string;
};

const Datatable = ({ columns, dataSource, rowKey = "id" }: DatatableProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<any[]>([]);

  /* ---------------- Sync datasource ---------------- */
  useEffect(() => {
    setFilteredDataSource(dataSource);
  }, [dataSource]);

  /* ---------------- Row selection ---------------- */
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  /* ---------------- Search ---------------- */
  const handleSearch = (value: string) => {
    setSearchText(value);

    const filtered = dataSource.filter((record: any) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilteredDataSource(filtered);
  };

  return (
    <>
      <div className="search-set table-search-set">
        <div className="search-input">
          <div className="dataTables_filter">
            <input
              type="search"
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control form-control-sm"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <Table
        className="table datanew dataTable no-footer w-full"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredDataSource}
        rowKey={rowKey}
        pagination={{
          locale: { items_per_page: "" },
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
    </>
  );
};

export default Datatable;

/* import React, { useState } from "react";
import { Table } from "antd";

const Datatable = ({ props, columns, dataSource }: any) => {
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSearch = (value: any) => {
    setSearchText(value);
    const filteredData = dataSource.filter((record: any) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredDataSource(filteredData);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div className="search-set table-search-set">
        <div className="search-input">
          <a href="#" className="btn btn-searchset">
            <i className="ti ti-search fs-14 feather-search" />
          </a>
          <div id="DataTables_Table_0_filter" className="dataTables_filter">
            <label>
              {" "}
              <input
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
                className="form-control form-control-sm"
                placeholder="Search"
                aria-controls="DataTables_Table_0"
              />
            </label>
          </div>
        </div>
      </div>

      <Table
        key={props}
        className="table datanew dataTable no-footer w-full"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredDataSource}
        rowKey={(record) => record.id}
        pagination={{
          locale: { items_per_page: "" },
          nextIcon: (
            <span>
              <i className="fa fa-angle-right" />
            </span>
          ),
          prevIcon: (
            <span>
              <i className="fa fa-angle-left" />
            </span>
          ),
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
    </>
  );
};

export default Datatable; */
