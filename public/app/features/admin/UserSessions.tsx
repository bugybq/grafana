import React, { PureComponent } from 'react';
import { css, cx } from 'emotion';
import appEvents from 'app/core/app_events';
import { ActionButton } from './ActionButton';
import { UserSession, CoreEvents } from 'app/types';
import { ConfirmButton } from '@grafana/ui';

interface Props {
  sessions: UserSession[];

  onSessionRevoke: (id: number) => void;
  onAllSessionsRevoke: () => void;
}

export class UserSessions extends PureComponent<Props> {
  handleSessionRevoke = (id: number) => {
    return () => {
      this.props.onSessionRevoke(id);
    };
  };

  handleAllSessionsRevoke = () => {
    appEvents.emit(CoreEvents.showConfirmModal, {
      title: 'Force logout from all devices',
      text: 'Are you sure you want to force logout from all devices?',
      yesText: 'Force logout',
      icon: 'fa-warning',
      onConfirm: () => {
        this.props.onAllSessionsRevoke();
      },
    });
  };

  render() {
    const { sessions } = this.props;
    const logoutFromAllDevicesClass = cx(
      'pull-right',
      css`
        margin-top: 0.8rem;
      `
    );

    return (
      <>
        <h3 className="page-heading">Sessions</h3>
        <div className="gf-form-group">
          <div className="gf-form">
            <table className="filter-table form-inline">
              <thead>
                <tr>
                  <th>Last seen</th>
                  <th>Logged on</th>
                  <th>IP address</th>
                  <th colSpan={2}>Browser &amp; OS</th>
                </tr>
              </thead>
              <tbody>
                {sessions &&
                  sessions.map((session, index) => (
                    <tr key={`${session.id}-${index}`}>
                      <td>{session.isActive ? 'Now' : session.seenAt}</td>
                      <td>{session.createdAt}</td>
                      <td>{session.clientIp}</td>
                      <td>{`${session.browser} on ${session.os} ${session.osVersion}`}</td>
                      <td>
                        <div className="pull-right">
                          <ConfirmButton
                            confirmText="Confirm logout"
                            confirmButtonVariant="danger"
                            onConfirm={this.handleSessionRevoke(session.id)}
                          >
                            Force logout
                          </ConfirmButton>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={logoutFromAllDevicesClass}>
            {sessions.length > 0 && (
              <ActionButton text="Force logout from all devices" onClick={this.handleAllSessionsRevoke} />
            )}
          </div>
        </div>
      </>
    );
  }
}
