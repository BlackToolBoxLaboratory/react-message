import React, { useRef } from 'react';
import { render } from 'react-dom';
import classnames from 'classnames';

import Notice from './Notice.jsx';
import QueueConext from './QueueContext.jsx';

const QUEUE_LIMITATION = 5;
const TRANSITIONE_TIME = 0.3 * 1000;
const DURATION_TIME = 3 * 1000;
const HORIZONTAL_POSITION = 'cneter'; // left, center, right
const VERTIAL_POSITION = 'top'; // top, middle, bottom
const CLOSEABLE_ENABLE = false;

const MessageProvider = (props) => {
  const { children, limit = QUEUE_LIMITATION, transitionInDuration = TRANSITIONE_TIME, transitionOutDuration = transitionInDuration, duration = DURATION_TIME, horizontal = HORIZONTAL_POSITION, vertical = VERTIAL_POSITION, closeable = CLOSEABLE_ENABLE } = props;
  const refQueue = useRef();
  const timeoutQueue = {};

  const classList = [`message-horizontal-${horizontal}`, `message-vertical-${vertical}`];

  const _clearTimeoutQueue = (id) => {
    if (timeoutQueue[id]) {
      clearTimeout(timeoutQueue[id]);
      delete timeoutQueue[id];
    }
  };

  const _removeMessage = (id) => {
    _clearTimeoutQueue(id);
    const queue = refQueue.current;
    queue.children[id].remove();
  };

  const _timeoutFadeIn = (id, time, callback = () => { }) => {
    _clearTimeoutQueue(id);
    timeoutQueue[id] = setTimeout(function countDown() {
      const queue = refQueue.current;
      queue.children[id].classList.add('container-showing');
      callback();
    }, time);
  };

  const _timeoutFadeOut = (id, time, callback = () => { }) => {
    _clearTimeoutQueue(id);
    timeoutQueue[id] = setTimeout(function countDown() {
      const queue = refQueue.current;
      queue.children[id].classList.remove('container-showing');
      callback();
    }, time);
  };

  const _timeoutRemove = (id, time, callback = () => { }) => {
    _clearTimeoutQueue(id);
    timeoutQueue[id] = setTimeout(function countDown() {
      _removeMessage(id);
      callback();
    }, time);
  };

  const _messageLifeCycle = (id) => {
    _clearTimeoutQueue(id);
    _timeoutFadeIn(id, transitionInDuration, () => {
      if (duration > 0) {
        _timeoutFadeOut(id, duration, () => {
          _timeoutRemove(id, transitionOutDuration);
        });
      }
    });
  };

  const _createMessage = (data) => {
    const queue = refQueue.current;
    const { id, className, context, closerNode, ...noticeProps } = data;

    const messageContainer = document.createElement('div');
    messageContainer.id = id;
    messageContainer.classList.add('message_container');
    queue.append(messageContainer);
    render((<Notice {...noticeProps} className={classnames(className, "container_content")}>
      <div className="content_context">
        {context}
      </div>
      {closeable ? <div className="content_closer" onClick={() => { _removeMessage(id); }}>{closerNode}</div> : []}
    </Notice>), document.getElementById(id));
  };

  const _sendMessage = (data) => {
    const queue = refQueue.current;
    const { type = 'normal', context = 'No message left.', closerNode = (<>&#x2716;</>) } = data;
    const messageData = {
      id: `message_${Date.now()}_${Math.ceil(Math.random() * 1000)}`,
      type,
      context,
      closerNode
    };
    if (queue.children.length >= limit) {
      _removeMessage(queue.children[0].id);
    }
    _createMessage(messageData);
    _messageLifeCycle(messageData.id);
  };

  return (
    <QueueConext.Provider value={{ send: _sendMessage }}>
      <div className={classnames("btb-react-message", classList)} ref={refQueue} />
      {children}
    </QueueConext.Provider>
  );
};

export default MessageProvider;
