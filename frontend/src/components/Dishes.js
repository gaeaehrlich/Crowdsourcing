import React from "react";
import {List, Card} from 'antd';

const { Meta } = Card;


class Dishes extends React.Component {

    dishToPicLocation = name => {
        let out;
        out = name.replace(/ /g, '_');
        return 'http://127.0.0.1:8000/api/pic/'+out;
    };

    render() {
        return (
            <List
                itemLayout="inline"
                size="large"
                grid={{ gutter: 0, column: 3 }}

                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 20,
                }}
                dataSource={this.props.data}
                renderItem={dish => (
                    <List.Item>
                        <Card
                            style={{ width: 300}}
                            cover={
                                <a href={'http://127.0.0.1:3000/dish/' + dish.id}>
                                    <img
                                        alt="So good..."
                                        src={this.dishToPicLocation(dish.title)}
                                        width="300"
                                        height="350"
                                    />

                                </a>
                            }>
                            <Meta
                                title={dish.title}
                                description={dish.content}
                            />
                        </Card>
                    </List.Item>
                )}
            />

        );
    }
}

export default Dishes;