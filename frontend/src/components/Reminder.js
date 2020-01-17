import React from "react";
import { List, Card } from 'antd';
import axios from "axios";

const { Meta } = Card;

class Reminder extends React.Component {

    state = {
        dishes: []
    };

    componentDidMount() {
        const data = this.props.data;
        for(let i = 0; i < data.length; i++) {
            axios.get(`http://127.0.0.1:8000/api/dish/${data[i]}`).then(res => {
                console.log(res.data);
                this.setState({
                    dishes: [...this.state.dishes, res.data]
                });
            }).catch(error => console.log(error));
        }
    }

    render() {
        return (
            <List
                grid={{gutter: 1, column: 4}}
                dataSource={this.state.dishes}
                renderItem={item => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{width: 240}}
                            cover={<img alt="example"
                                        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                        >
                            <Meta title={item.title} description={item.content}/>
                        </Card>
                    </List.Item>
                )}
            />
        );
    }
}

export default Reminder;