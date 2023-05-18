import React from "react";
import { Form } from "semantic-ui-react";

interface ReplyFormProps {}

export const ReplyForm: React.FC<ReplyFormProps> = () => {
  return (
    <div className="m-5">
      <Form>
        <Form.Input
          label="Reply"
          placeholder="write your reply here"
          type="text-area"
        />
        <Form.Button>Add Reply</Form.Button>
      </Form>
    </div>
  );
};
