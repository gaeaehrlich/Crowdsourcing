import React from "react";
import { List, Icon } from 'antd';


const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);


const Reviews = (props) => {
    return(
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={props.data}
        renderItem={item => (
          <List.Item
            key={item.title}
            actions={[
              <IconText type="star-o" text={item.stars} key="list-vertical-star-o" />,
              <IconText type="like-o" text={item.likes} key="list-vertical-like-o" />,
            ]}
            extra={
              <img
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <List.Item.Meta
              title={<a href={`/${item.id}/`}>{item.dish.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    );
};

export default Reviews;