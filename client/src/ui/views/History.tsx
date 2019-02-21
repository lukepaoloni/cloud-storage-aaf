import * as React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class History extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <h5 className="title">View History</h5>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Name</th>
                        <th>Action</th>
                        <th>User</th>
                        <th className="text-center">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Yosemite.png</td>
                        <td>Uploaded version 2 of the file.</td>
                        <td>John Smith</td>
                        <td className="text-center">1 hour ago</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default History;
