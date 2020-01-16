import {List} from 'antd';
import React from "react";

const Gifts = (props) => {
    return(
        <List
            itemLayout="horizontal"
            dataSource={props.data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<a>{item.restaurant.name}</a>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
    );
};

export default Gifts;