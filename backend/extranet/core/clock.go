package core

import (
	"extranet/core/date"
	"extranet/core/timeutil"
	"time"
)

type Clock interface {
	Now() time.Time
	Today(at *time.Location) date.Date
	TodayAtBrazil() date.Date
}

func NewSystemClock() Clock {
	return NewClock(func() time.Time {
		return time.Now()
	})
}

func NewClock(nowFunc func() time.Time) Clock {
	return &clock{nowFunc: nowFunc}
}

func NewFixedClock(moment time.Time) Clock {
	return NewClock(func() time.Time {
		return moment
	})
}

type clock struct {
	nowFunc func() time.Time
}

func (c *clock) TodayAtBrazil() date.Date {
	return c.Today(timeutil.BrazilLocation)
}

func (c *clock) Today(at *time.Location) date.Date {
	return date.NewDateFromTime(c.Now(), at)
}

func (c *clock) Now() time.Time {
	return c.nowFunc()
}
