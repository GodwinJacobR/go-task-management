package errors

import "errors"

var ErrConcurrentModification = errors.New("task was modified by another user")
