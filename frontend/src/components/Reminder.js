import React from "react";
import { List, Card } from 'antd';

const { Meta } = Card;

const Reminder = (props) => {
  return (
      <List
          grid={{gutter: 1, column: 4}}
          dataSource={props.data}
          renderItem={item => (
              <List.Item>
                <Card
                    hoverable
                    style={{width: 240}}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                >
                  <Meta title={item.title} description={item.content}/>
                </Card>
              </List.Item>
          )}
      />
  );
};

export default Reminder;