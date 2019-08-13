import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Spin, Tag, Menu, Icon, message, Tooltip, Divider } from 'antd';
import IconFont from '@/components/IconFont';
// Avatar
import PropTypes from 'prop-types';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    // 设置选项
    const settingMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="overview">
          <IconFont type="OS-iconzonglan" />
          <FormattedMessage id="menu.setting.overview" defaultMessage="Overview" />
        </Menu.Item>
        <Menu.Item key="counter">
          <IconFont type="OS-iconjisuanqi" />
          <FormattedMessage id="menu.setting.counter" defaultMessage="Counter" />
        </Menu.Item>
        <Menu.Item key="sysConfig">
          <IconFont type="OS-iconziyuan" />
          <FormattedMessage id="menu.setting.sysConfig" defaultMessage="System Configuration" />
        </Menu.Item>
        <Menu.Item key="userManage">
          <IconFont type="OS-iconyonghuguanli" />
          <FormattedMessage id="menu.setting.userManage" defaultMessage="User Management" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="about">
          <Icon type="exclamation-circle" />
          <FormattedMessage id="menu.setting.about" defaultMessage="About" />
        </Menu.Item>
      </Menu>
    );
    // 用户信息
    const userManageMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item> */}
        <Menu.Item key="operatLog">
          <IconFont type="OS-iconrecord" />
          <FormattedMessage id="menu.account.operatLog" defaultMessage="Operation Log" />
        </Menu.Item>
        <Menu.Item key="updatePwd">
          <IconFont type="OS-iconpassword" />
          <FormattedMessage id="menu.account.updatePwd" defaultMessage="Modify Password" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="poweroff" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/* <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        /> */}
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <NoticeIcon
          className={styles.action}
          count={currentUser.unreadCount}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
            this.changeReadState(item, tabProps);
          }}
          loading={fetchingNotices}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
            clear: formatMessage({ id: 'component.noticeIcon.clear' }),
            viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
            notification: formatMessage({ id: 'component.globalHeader.notification' }),
            message: formatMessage({ id: 'component.globalHeader.message' }),
            event: formatMessage({ id: 'component.globalHeader.event' }),
          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          onViewMore={() => message.info('Click on view more')}
          clearClose
        >
          <NoticeIcon.Tab
            count={unreadMsg.notification}
            list={noticeData.notification}
            title="notification"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            showViewMore
          />
          <NoticeIcon.Tab
            count={unreadMsg.message}
            list={noticeData.message}
            title="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showViewMore
          />
          <NoticeIcon.Tab
            count={unreadMsg.event}
            list={noticeData.event}
            title="event"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            showViewMore
          />
        </NoticeIcon>
        {/* 设置 */}
        <HeaderDropdown overlay={settingMenu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Icon type="setting" key="Icon" className={styles.setting} />
            <FormattedMessage id="menu.account.settings" defaultMessage="Account Settings" />
          </span>
        </HeaderDropdown>
        <Divider type="vertical" />
        {currentUser.name ? (
          <HeaderDropdown overlay={userManageMenu}>
            <span className={`${styles.action} ${styles.account}`}>
              {/* <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              /> */}
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}

GlobalHeaderRight.propTypes = {
  notices: PropTypes.any,
  dispatch: PropTypes.any,
  currentUser: PropTypes.any,
  fetchingNotices: PropTypes.any,
  onNoticeVisibleChange: PropTypes.any,
  onMenuClick: PropTypes.any,
  onNoticeClear: PropTypes.any,
  theme: PropTypes.any,
}
