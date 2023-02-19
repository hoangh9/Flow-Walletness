package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/flow-hydraulics/flow-wallet-api/accounts"
	"github.com/flow-hydraulics/flow-wallet-api/errors"
	"github.com/gorilla/mux"
)

// List returns all accounts.
func (s *Accounts) ListFunc(rw http.ResponseWriter, r *http.Request) {
	limit, err := strconv.Atoi(r.FormValue("limit"))
	if err != nil {
		limit = 0
	}

	offset, err := strconv.Atoi(r.FormValue("offset"))
	if err != nil {
		offset = 0
	}

	res, err := s.service.List(limit, offset)

	if err != nil {
		handleError(rw, r, err)
		return
	}

	handleJsonResponse(rw, http.StatusOK, res)
}

// Create creates a new account asynchronously.
// It returns a Job JSON representation.
func (s *Accounts) CreateFunc(rw http.ResponseWriter, r *http.Request) {
	// Decide whether to serve sync or async, default async
	
	var account accounts.AccountRequest

	if r.Body == nil || r.Body == http.NoBody {
		err := &errors.RequestError{StatusCode: http.StatusBadRequest, Err: fmt.Errorf("empty body")}
		handleError(rw, r, err)
		return
	}

	// Try to decode the request body.
	if err := json.NewDecoder(r.Body).Decode(&account); err != nil {
		err = &errors.RequestError{StatusCode: http.StatusBadRequest, Err: fmt.Errorf("invalid body")}
		handleError(rw, r, err)
		return
	}
	sync := r.FormValue(SyncQueryParameter) != ""
	job, acc, err := s.service.Create(r.Context(), sync , account )

	if err != nil {
		handleError(rw, r, err)
		return
	}

	var res interface{}
	if sync {
		res = acc
	} else {
		res = job.ToJSONResponse()
	}

	handleJsonResponse(rw, http.StatusCreated, res)
}

// Details returns details regarding an account.
// It reads the address for the wanted account from URL.
// Account service is responsible for validating the address.
func (s *Accounts) DetailsFunc(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	res, err := s.service.Details(vars["address"])

	if err != nil {
		handleError(rw, r, err)
		return
	}

	handleJsonResponse(rw, http.StatusOK, res)
}
func (s *Accounts) GetUsernameFunc(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	res, err := s.service.GetUsername(vars["username"])

	if err != nil {
		handleError(rw, r, err)
		return
	}

	handleJsonResponse(rw, http.StatusOK, res)
}

func (s *Accounts) AddNonCustodialAccountFunc(rw http.ResponseWriter, r *http.Request) {
	err := checkNonEmptyBody(r)
	if err != nil {
		handleError(rw, r, err)
		return
	}

	var b accounts.Account

	// Try to decode the request body into the struct.
	err = json.NewDecoder(r.Body).Decode(&b)
	if err != nil {
		err = &errors.RequestError{
			StatusCode: http.StatusBadRequest,
			Err:        fmt.Errorf("invalid body"),
		}
		handleError(rw, r, err)
		return
	}

	a, err := s.service.AddNonCustodialAccount(b.Address)
	if err != nil {
		handleError(rw, r, err)
	}

	handleJsonResponse(rw, http.StatusCreated, a)
}

func (s *Accounts) DeleteNonCustodialAccountFunc(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	err := s.service.DeleteNonCustodialAccount(vars["address"])
	if err != nil {
		handleError(rw, r, err)
		return
	}

	rw.WriteHeader(http.StatusOK)
}

func (s *Accounts) SyncAccountKeyCountFunc(rw http.ResponseWriter, r *http.Request) {
	// Check body is not empty
	if err := checkNonEmptyBody(r); err != nil {
		handleError(rw, r, err)
		return
	}

	var req SyncKeyCountRequest
	// Try to decode the request body.
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		err = &errors.RequestError{StatusCode: http.StatusBadRequest, Err: fmt.Errorf("invalid body")}
		handleError(rw, r, err)
		return
	}

	job, err := s.service.SyncAccountKeyCount(r.Context(), req.Address)
	if err != nil {
		handleError(rw, r, err)
		return
	}

	handleJsonResponse(rw, http.StatusOK, job)
}
// Create account by Username.
// It returns a Address JSON representation.
func (s *Accounts) GetAddressByUsernameFunc(rw http.ResponseWriter, r *http.Request) {
	// Decide whether to serve sync or async, default async
	
	var account accounts.AccountRequest

	if r.Body == nil || r.Body == http.NoBody {
		err := &errors.RequestError{StatusCode: http.StatusBadRequest, Err: fmt.Errorf("empty body")}
		handleError(rw, r, err)
		return
	}

	// Try to decode the request body.
	if err := json.NewDecoder(r.Body).Decode(&account); err != nil {
		err = &errors.RequestError{StatusCode: http.StatusBadRequest, Err: fmt.Errorf("invalid body")}
		handleError(rw, r, err)
		return
	}
	
	res, err := s.service.GetAddressByUsername(account.Username , account.Password)

	if err != nil {
		handleError(rw, r, err)
		return
	}

	handleJsonResponse(rw, http.StatusOK, res)

}