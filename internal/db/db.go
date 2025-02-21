package db

type Db struct {
}

func New() (*Db, error) {
	return &Db{}, nil
}
