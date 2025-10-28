import { DeleteTwoTone, LinkOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import { useTranslation } from "react-i18next";
import { pickTranslation, TableColumn, TableFilter } from "../../utils";
import "./index.css";
import { isImmutableYear } from "@/utils/event";
import { useSelector } from "react-redux";
import { HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID, SHOULD_NOT_CLEAR_LIST } from "@/constants/app-config";
import { HH_STATUS_ATTR_ID } from "../constants";
import { Chip } from "@material-ui/core";

const RegisteredTeiList = ({
  teis,
  page,
  pageSize,
  total,
  trackedEntityAttributes,
  onDeleteTei,
  onFilter,
  onChangePage,
  onSort,
  onRowClick,
}) => {
  const { t, i18n } = useTranslation();
  const { immutableYear } = useSelector((state) => state.metadata);
  const reportId = useSelector((state) => state.common.reportId);

  const createColumns = () => {
    
    let columns = trackedEntityAttributes
      ?.filter((tea) => tea.displayInList || tea.displayInReports)
      .map((tea) => {
        if(tea.trackedEntityAttribute) {
          tea = {
            ...tea,
            ...tea.trackedEntityAttribute
          }
        }
        else if(tea.dataElement) {
          tea = {
            ...tea,
            ...tea.dataElement
          }
        }

        const teaObject = {
          title: pickTranslation(tea, i18n.language),
          dataIndex: tea.id,
          key: tea.id,
          sorter: true,
          valueSet: tea.valueSet,
          filterDropdown: (
            <TableFilter placeholder={pickTranslation(tea, i18n.language)} metadata={tea} onFilter={onFilter} />
          ),
          render: (value) => <TableColumn metadata={tea} value={value} />,
        };

        return teaObject;
      });

    const lastUpdatedObject = {
      title: t("lastUpdated"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      // filterDropdown: TableFilter(null, onFilter, {
      //   name: "lastupdated",
      //   type: "DATE",
      // }),
      render: (value) => {
        return <TableColumn metadata={null} external={{ name: "updatedAt", type: "DATE" }} value={value} />;
      },
    };
    columns.unshift(lastUpdatedObject);

    return columns;
  };

  const createDataSource = () => {
    const columns = createColumns();

    const data = teis.trackedEntities.map((tei, index) => {
      const rowObject = {
        key: index,
      };

      if(tei.teiId) rowObject.teiId = tei.teiId;
      else if(tei.eventId) rowObject.eventId = tei.eventId;
      
      columns.forEach((column) => {
        const attribute = tei.values.find((attr) => {
          return attr.id === column.dataIndex;
        });

        rowObject[column.dataIndex] = attribute ? attribute.value : "";
      });

      rowObject.updatedAt = tei.updatedAt;
      return rowObject;
    });

    return data;
  };

  return (
    <Table
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            onRowClick(record, rowIndex, event);
          },
        };
      }}
      rowHoverable={false}
      columns={createColumns()}
      dataSource={createDataSource()}
      scroll={{ /*y: "calc(100vh - 268px)",*/ x: 900 }}
      className="my-2 px-1"
      pagination={{
        position: ["bottomCenter"],
        showSizeChanger: true,
        current: page,
        pageSize: pageSize,
        total: total,
        onChange: onChangePage,
      }}
      onChange={(pagination, filters, sorter, { currentDataSource: [], action }) => {
        if (action === "sort") {
          onSort(sorter);
        }
      }}
      onChangePage={onChangePage}
    />
  );
};

export default RegisteredTeiList;
