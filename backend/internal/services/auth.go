package services

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/internal/repositories"
	"backend/pkg/utils"
	"errors"
	"fmt"
	"net/mail"
	"regexp"
)

type authService struct {
	AuthRepository repositories.IAuthRepository
}

type IAuthService interface {
	CheckPermissionAdmin(uid string) error
	Login(userData entities.UserLogin) (isValid bool, user *entities.UserAuth, err error)
	Register(userData entities.UserAuth) (err error)
	LoginWithGoogle(uid string, userData entities.UserAuth) (user *entities.UserAuth, err error)
	GetUserByUID(uid string) (user *entities.UserAuth, err error)
	CheckPermissionSuperAdmin(uid string) error
}

func InitAuthenService(repo repositories.IAuthRepository) IAuthService {
	return &authService{
		AuthRepository: repo,
	}
}

func (ser authService) CheckPermissionAdmin(uid string) error {
	user, err := ser.AuthRepository.GetUserByUID(uid)
	if err != nil {
		return err
	}

	if !(user.Role == "admin" || user.Role == "superadmin") {
		return templateError.ForbiddenError
	}

	return nil
}

func (ser authService) CheckPermissionSuperAdmin(uid string) error {
	user, err := ser.AuthRepository.GetUserByUID(uid)
	if err != nil {
		return err
	}

	if !(user.Role == "superadmin") {
		return templateError.ForbiddenError
	}

	return nil
}

func (ser authService) Login(userData entities.UserLogin) (isValid bool, user *entities.UserAuth, err error) {
	if userData.Email == "" {
		return false, nil, templateError.BadrequestError
	}
	if _, err := mail.ParseAddress(userData.Email); err != nil {
		return false, nil, templateError.BadrequestError
	}
	if userData.Password == "" {
		return false, nil, templateError.BadrequestError
	}
	user, err = ser.AuthRepository.GetUser(userData.Email)
	if err != nil {
		if errors.Is(err, templateError.UsernotfoundError) {
			return false, nil, templateError.WrongUserOrPasswordError
		} else {
			fmt.Println(err)
			return false, nil, err
		}
	}
	if user.Password == "" {
		return false, nil, nil
	}
	isValid, err = utils.VerifyPassword(userData.Password, user.Password)
	if err != nil {
		fmt.Println(err)
		return false, nil, err
	}
	if !isValid {
		return false, nil, templateError.WrongUserOrPasswordError
	}
	return
}

func (ser authService) Register(userData entities.UserAuth) (err error) {
	if userData.Email == "" {
		return templateError.BadrequestError
	}
	if _, err := mail.ParseAddress(userData.Email); err != nil {
		return templateError.EmailInvaildFormatError
	}
	if userData.Password == "" {
		return templateError.BadrequestError
	}
	if !validatePassword(userData.Password) {
		return templateError.BadrequestError
	}

	_, err = ser.AuthRepository.GetUser(userData.Email)
	if !errors.Is(err, templateError.UsernotfoundError) {
		return templateError.EmailAlreadyExistError
	}

	// hash password
	hashedPassword, err := utils.HashPassword(userData.Password)
	if err != nil {
		fmt.Println(err)
		return err
	}
	userData.Password = hashedPassword

	err = ser.AuthRepository.CreateUser(userData)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return
}

func (ser authService) LoginWithGoogle(uid string, userData entities.UserAuth) (user *entities.UserAuth, err error) {
	user, err = ser.AuthRepository.GetUserByUID(uid)
	if err != nil {
		if errors.Is(err, templateError.UsernotfoundError) {
			userData.Logintype = "Google"
			if err = ser.AuthRepository.CreateUser(userData); err != nil {
				return nil, err
			}
			return &userData, nil
		} else {
			return nil, err
		}
	}
	return
}

func (ser authService) GetUserByUID(uid string) (user *entities.UserAuth, err error) {
	user, err = ser.AuthRepository.GetUserByUID(uid)
	if err != nil {
		return nil, err
	}
	return
}

func validatePassword(password string) bool {
	// ความยาวขั้นต่ำ
	if len(password) < 8 {
		return false
	}

	// มีตัวพิมพ์เล็กอย่างน้อย 1 ตัว
	hasLowercase, _ := regexp.MatchString(`[a-z]`, password)
	if !hasLowercase {
		return false
	}

	// มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
	hasUppercase, _ := regexp.MatchString(`[A-Z]`, password)
	if !hasUppercase {
		return false
	}

	// มีตัวเลขอย่างน้อย 1 ตัว
	hasNumber, _ := regexp.MatchString(`[0-9]`, password)
	if !hasNumber {
		return false
	}

	// มีสัญลักษณ์อย่างน้อย 1 ตัว
	hasSymbol, _ := regexp.MatchString(`[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]+`, password)
	return hasSymbol
}
