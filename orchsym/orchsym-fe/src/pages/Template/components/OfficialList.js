import React, { PureComponent } from 'react';
import { Table, Icon, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import styles from '../index.less';

@connect(({ template }) => ({
  officialList: template.officialList,
}))
class OfficialList extends PureComponent {
  state = {
  };


  componentDidMount() {
    const { pageNum, pageSizeNum, searchVal, sortedField, isDesc } = this.props
    this.getList(pageNum, pageSizeNum, sortedField, isDesc, searchVal)
  }

  getList = (page, pageSize, sortedField, isDesc, text) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/fetchOfficialTemplates',
      payload: {
        page,
        pageSize,
        text,
        sortedField,
        isDesc,
      },
    });
  }

  operateMenu = (item) => {
    console.log(item)
    const menu = (
      <Menu>
        <Menu.Item key="edit">
          {`${formatMessage({ id: 'button.edit' })}`}
        </Menu.Item>
        <Menu.Item key="cancelCollect">
          {`${formatMessage({ id: 'button.cancelCollect' })}`}
        </Menu.Item>
        <Menu.Item key="download">
          {`${formatMessage({ id: 'button.download' })}`}
        </Menu.Item>
        <Menu.Item key="delete">
          {`${formatMessage({ id: 'button.delete' })}`}
        </Menu.Item>
      </Menu>
    );
    return (
      <span className={styles.operateMenu}>
        <Icon type="star" theme="filled" style={{ color: '#faad14' }} />
        {/* <Icon type="star" theme="twoTone" /> */}
        <Dropdown overlay={menu} trigger={['click']}>
          <Icon type="ellipsis" key="ellipsis" style={{ marginLeft: '5px' }} />
        </Dropdown>
      </span>
    )
  }

  render() {
    const { officialList } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'template.name',
        key: 'name',
        // render: text => <a>{text}</a>,
      },
      {
        title: '描述',
        dataIndex: 'template.description',
        key: 'description',
        render: (text, record) => (
          <Ellipsis tooltip length={23}>
            {text || '-'}
          </Ellipsis>
        ),
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '创建/发布时间',
        dataIndex: 'template.timestamp',
        key: 'time',
        render: (text, record) => {
          const time = moment(text).format('YYYY-MM-DD HH:mm:ss');
          return <span>{time}</span>;
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => (this.operateMenu(record)),
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={officialList}
          rowKey="id"
          pagination={{
            size: 'small',
            defaultPageSize: 10,
            total: 20,
            showTotal: () => `共${20}个`,
            current: 1,
            onChange: this.changePage,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
        // loading={loading}
        />
      </div>
    );
  }
}
export default OfficialList
