<template>
  <div class="user join wrapC">
    <h1>가입하기</h1>

    <!-- 회원가입 폼 -->
    <div v-if="!isSuccess" class="form-wrap">
      <div class="input-with-label">
        <input v-model="nickName" id="nickname" placeholder=" " type="text" @input="validateForm" />
        <label for="nickname" class="floating-label">닉네임</label>
        <p v-if="errors.nickName" class="error">{{ errors.nickName }}</p>
      </div>

      <div class="input-with-label">
        <input v-model="email" id="email" placeholder=" " type="email" autocomplete="off" autocapitalize="none" @input="validateForm" />
        <label for="email" class="floating-label">이메일</label>
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="input-with-label">
        <input v-model="password" id="password" :type="passwordType" placeholder=" " @input="validateForm" />
        <label for="password" class="floating-label">비밀번호</label>
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <div class="input-with-label">
        <input v-model="passwordConfirm" :type="passwordConfirmType" id="password-confirm" placeholder=" " @input="validateForm" />
        <label for="password-confirm" class="floating-label">비밀번호 확인</label>
        <p v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm }}</p>
      </div>
    </div>

    <!-- 약관 동의 및 가입 버튼 -->
    <div v-if="!isSuccess">
      <label>
        <input v-model="isTerm" type="checkbox" id="term" @change="validateForm" />
        <span>약관을 동의합니다.</span>
      </label>

      <span @click="termPopup = true">약관보기</span>

      <button class="btn-bottom" :disabled="!isFormValid || isLoading" @click="submitForm">가입하기</button>
    </div>

    <!-- 회원가입 완료 후 -->
    <div v-if="isSuccess" class="success-wrap">
      <h2>회원가입이 완료되었습니다!</h2>
      <p class="success">회원가입 인증 메일이 발송되었습니다. 이메일을 확인해 주세요.</p>
      <div class="actions">
        <button @click="resendEmail" :disabled="isResending" class="btn-bottom">메일 재발송</button>
        <a href="https://mail.google.com" target="_blank" class="btn-bottom">메일함으로 이동</a>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <p v-if="generalError" class="error">{{ generalError }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: "",
    password: "",
    passwordConfirm: "",
    nickName: "",
    isTerm: false,
    isLoading: false,
    errors: {
      email: "",
      password: "",
      nickName: "",
      passwordConfirm: "",
    },
    successMessage: "",
    generalError: "",
    passwordType: "password",
    passwordConfirmType: "password",
    termPopup: false,
    isSuccess: false, // 회원가입 성공 여부
    isResending: false, // 메일 재발송 중 여부
  }),
  computed: {
    isFormValid() {
      return this.nickName && this.email && this.password && this.passwordConfirm && this.isTerm && Object.values(this.errors).every((error) => !error)
    },
  },
  methods: {
    validateForm() {
      // Reset errors
      this.errors = {
        email: "",
        password: "",
        nickName: "",
        passwordConfirm: "",
      }

      // 이메일 유효성 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.errors.email = "유효한 이메일 주소를 입력하세요."
      }

      // 비밀번호 유효성 검사
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W).{8,15}$/
      if (!passwordRegex.test(this.password)) {
        this.errors.password = "비밀번호는 8-15자, 문자, 숫자, 특수문자가 포함되어야 합니다."
      }

      // 비밀번호 확인 검사
      if (this.password !== this.passwordConfirm) {
        this.errors.passwordConfirm = "비밀번호가 일치하지 않습니다."
      }

      // 닉네임 유효성 검사
      if (this.nickName.length < 3) {
        this.errors.nickName = "닉네임은 최소 3자 이상이어야 합니다."
      }
    },
    async submitForm() {
      this.isLoading = true
      this.successMessage = ""
      this.generalError = ""

      try {
        const response = await this.$axios.post("/api/signup/", {
          email: this.email,
          password1: this.password,
          password2: this.passwordConfirm,
          nickName: this.nickName,
        })
        this.successMessage = "회원가입이 완료되었습니다!"
        this.isSuccess = true // 회원가입 완료 상태로 변경
        this.resetForm()
      } catch (error) {
        this.generalError = error.response?.data?.errors || "회원가입 중 문제가 발생했습니다."
      } finally {
        this.isLoading = false
      }
    },
    resetForm() {
      this.email = ""
      this.password = ""
      this.passwordConfirm = ""
      this.nickName = ""
      this.isTerm = false
      this.errors = {
        email: "",
        password: "",
        nickName: "",
        passwordConfirm: "",
      }
    },
    async resendEmail() {
      this.isResending = true
      try {
        // 재발송 요청
        await this.$axios.post("/api/resend-email", { email: this.email })
        this.successMessage = "인증 메일이 재발송되었습니다."
      } catch (error) {
        this.generalError = "메일 재발송 중 오류가 발생했습니다."
      } finally {
        this.isResending = false
      }
    },
  },
}
</script>

<style>
.input-with-label {
  position: relative;
  margin-bottom: 1rem;
}

.input-with-label input {
  width: 100%;
  padding: 10px 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.input-with-label input:focus {
  border-color: #007bff;
}

.input-with-label input:focus + .floating-label,
.input-with-label input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-20px);
  font-size: 12px;
  color: #007bff;
}

.floating-label {
  position: absolute;
  left: 10px;
  top: 10px;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #aaa;
  pointer-events: none;
}

.error {
  color: red;
  font-size: 0.9em;
}

.success {
  color: green;
  font-size: 0.9em;
}

.success-wrap {
  text-align: center;
  padding: 20px;
}

.actions {
  margin-top: 20px;
}

.btn-bottom {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-bottom:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
