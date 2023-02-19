import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { addTodoOnServer } from '../../api/todos';

import { ErrorType } from '../../enums/ErrorType';

import { Todo } from '../../types/Todo';
import { AuthContext } from '../../contexts/AuthContext';
import { TodoToPost } from '../../types/TodoToPost';

type Props = {
  activeTodosNum: number;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  showTempTodo: (tempTodoTitle: string) => void;
  onAddNewTodo: (newTodo: Todo) => void;
  onToggleTodosStatus: () => void;
};

export const TodoHeader: React.FC<Props> = React.memo(
  ({
    activeTodosNum,
    showError,
    hideError,
    showTempTodo,
    onAddNewTodo,
    onToggleTodosStatus,
  }) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const { id: userId = 0 } = useContext(AuthContext) || {};

    const handleAddingNewTodo = async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      const title = newTodoTitle.trim();

      if (!title) {
        showError(ErrorType.EmptyTitle);

        return;
      }

      hideError();
      showTempTodo(title);

      setIsInputDisabled(true);

      const newTodo: TodoToPost = {
        userId,
        title,
        completed: false,
      };

      try {
        const createdTodo = await addTodoOnServer(userId, newTodo);

        onAddNewTodo(createdTodo);
      } catch {
        showError(ErrorType.Add);
      } finally {
        showTempTodo('');
        setNewTodoTitle('');
        setIsInputDisabled(false);
      }
    };

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosNum === 0,
          })}
          onClick={onToggleTodosStatus}
          aria-label="Toggle all todos"
        />

        <form onSubmit={handleAddingNewTodo}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);
